const mongo = require('../../db/mongodb')
const { hashPayload, jwt } = require('../../utils');
const mongoDBHelper = require('../../lib/mongoDBHelper');
const depsModel = require('./dep.models');
const userModel = require('../users/users.models')
const {logger} = require('../../utils')
const httpStatus = require('../../constants/httpStatus')
const config = require('../../constants/config')
const responseMessages =  require('../../constants/responseMessages')
const paystack = require('paystack')(config.paystack.secret_key)
const {getUserDetails} = require('../users/users.services')

const DepsMongoDBHelper = new mongoDBHelper(mongo, depsModel);
const UserMongoDBHelper = new mongoDBHelper(mongo, userModel)

const initiateNewDeposit = async (body, userId) => {
  try{
    let user_details = await getUserDetails(userId)
    console.log({user_details, userId})
    let deps_obj = {
      ...body, user: userId
    }

    logger.info(`Saving Deposit Object ${JSON.stringify(deps_obj)} to DB`);

    let deps_response = await DepsMongoDBHelper.save(deps_obj);
    logger.info(`Initializing Paystack Transaction for Deposit with Id ${deps_response._id}`)
    return paystack.transaction.initialize({
      amount: body.amount * 100,
      reference: deps_response._id,
      email: user_details.email,
      callback_url: '127.0.0.1:3001/v1/deposits/verify'
    }, (err, body) => {
      if (err) throw ({message: 'Error initializing Deposit'});
      return body.data
    })
  }catch(error){
 
    logger.info(`Error Initializing Deposit err = ${error}`)
    throw (error)
  }
}

const verifyDeposit = async (reference) => {
    logger.info(`verifying Paystack transaction for reference ${reference}`);
    return paystack.transaction.verify(reference, async (err, body) => {
        if (err) {
            console.log(err);
            throw new Error({message: `Error Verifying Transaction`})
        }
        if (body.data.status === 'success') {
            let conditions = {_id: reference};
            let deposit_obj = await DepsMongoDBHelper.getOneOptimized({conditions});
            return _creditDepositor(deposit_obj.user, deposit_obj.amount)

        } else {
            const params = {_id: reference};
            this.logger.info(`Transaction ${reference} not Verified/Unsuccessful`)
            const data = {status: config.DepositStatus.UNSUCCESSFUL};
            return this.depositMongoDBHelper.update(params, data);
        }
    });
}

const getAllDeposits = async (userId) => {
  try{
    let conditions = {user: userId}
    let populate = ['user'];
    return DepsMongoDBHelper.getBulk({conditions, populate})
  }catch(error){
    throw(error)
  }
}

const getDepositDetails = async (deps_id) => {
  try{
    let conditions = {_id: deps_id}
    let populate = ['user'];
    return DepsMongoDBHelper.getOneOptimized({conditions, populate})
  }catch(error){
    throw(error)
  }
}

const _creditDepositor = async (depositorId, amount) => {
  logger.info(`updating user ${ depositorId } account balance with ${ amount }`);
  const conditions = {_id: depositorId};
  return UserMongoDBHelper.getOneOptimized({conditions})
      .then(async (user) => {
          const saveCondition = {_id: user._id};
          const newAmount = user.account_balance + parseInt(amount);
          await UserMongoDBHelper.update({conditions: saveCondition}, {account_balance: newAmount});
          return DepsMongoDBHelper.update({
            conditions: {user: user._id}, 
          }, {status: config.status.SUCCESSFUL})
      });
};




module.exports = {
  initiateNewDeposit, verifyDeposit, getAllDeposits, getDepositDetails
};
