const {MongoDB: mongo, Redis: redis} = require('../../db')
const { hashPayload, jwt } = require('../../utils');
const mongoDBHelper = require('../../lib/mongoDBHelper');
const smsHelper = require('../../lib/sendSmsHelper');
const redisHelper = require('../../lib/redisHelper')
const gpc = require('generate-pincode')
const {comparePin} = require('../../lib/passwordHelper')
const transModel = require('./trans.models');
const userModel = require('../users/users.models')
const {logger} = require('../../utils')
const httpStatus = require('../../constants/httpStatus')
const config = require('../../constants/config')
const responseMessages =  require('../../constants/responseMessages')
const {getUserDetails} = require('../users/users.services')

const TransMongoDBHelper = new mongoDBHelper(mongo, transModel);
const UserMongoDBHelper = new mongoDBHelper(mongo, userModel)
const SendSms = new smsHelper(logger)
const OtpRedisHelper = new redisHelper(redis)

const makeNewTransfer = async (body, userId) => {
  try{
    let sender = await _getSenderDetails(userId)
    let isMatch = await comparePin(sender.pin, body.pin);

    if(!isMatch) throw({
      code: httpStatus.UNAUTHORIZED,
      message: 'Incorrect Pin'
    })

    const  new_transfer_obj = {
      amount: body.amount,
      sender_id: userId,
      recipient_wallet_id: body.recipient_wallet_id,
      amount: body.amount,
      status: config.status.PENDING,
      sender_wallet_id: sender.wallet_id
    }

    await _updateSenderBalance(userId, body.amount);

    let recipient = await _getRecipientDetails(new_transfer_obj.recipient_wallet_id);
    if(!recipient) throw({
      code: httpStatus.BAD_REQUEST,
      message: 'Invalid Wallet ID'
    })

    new_transfer_obj.recipient_id = recipient._id

    await _sendOtpToUser(sender);
    logger.info(`Saving New Transfer Obj Between Sender ${userId} and Recipient ${recipient._id}`);
    return TransMongoDBHelper.save(new_transfer_obj)
  }catch(error){
 
    logger.info(`Error Initializing Transfer err = ${error}`)
    throw (error)
  }
}

const completeTransfer = async (otp, userId, transfer_id) => {
  try{
    let transfer_details = await TransMongoDBHelper.getOneOptimized({conditions: {_id: transfer_id}});
    if(!transfer_details) throw({
      code: httpStatus.BAD_REQUEST,
      message: 'Invalid Transfer ID'
    })
    if(transfer_details.status !== config.status.PENDING) throw({
      code: httpStatus.BAD_REQUEST,
      message: 'This Transfer has been closed'
    })
    let redis_obj = await OtpRedisHelper.get(userId);
    if(otp.toString() !== redis_obj.otp.toString()) throw ({
      code: httpStatus.BAD_REQUEST,
      message: 'Invalid OTP'
    })

    await _updateRecipientBalance(transfer_details.recipient_wallet_id, transfer_details.amount)
    return _updateTransferStatus(transfer_details._id, config.status.SUCCESSFUL)
  }catch(error){
    throw(error)
  }

}


const getAllTransfers = async (userId) => {
  try{
    let conditions = {$or: [{sender_id: userId}, {recipient_id: userId}]};
    return TransMongoDBHelper.getBulk({conditions})
  }catch(error){
    throw(error)
  }
}

const getTransferDetails = async (trans_id) => {
  try{
    let conditions = {_id: trans_id};
    return TransMongoDBHelper.getOneOptimized({conditions})
  }catch(error){
    throw (error)
  }
}

/**
 * This method checks if the sender has enough money and deletes from the user balance
 * 
 */

const _updateSenderBalance = async (sender_id, amount) => {
  let conditions = {_id: sender_id};
  try{
    let sender = await UserMongoDBHelper.getOneOptimized({conditions});
    let account_balance = sender.account_balance;
    if(account_balance < amount) throw({message: 'Insufficient Balance'})

    let new_balance = account_balance - amount;
    logger.info(`Updating Sender with user_id ${sender_id} account balance with "-${amount}"`);
    return UserMongoDBHelper.update({conditions}, {account_balance: new_balance})
  }catch(error){
    throw(error)
  }
}

const _sendOtpToUser = async (user) => {
  let otp = gpc(6);
  let params =  {
    otp,
    phone_number: user.phone_number
  };

  await OtpRedisHelper.set(user._id, params, 60*5);
  logger.info(`Sending OTP ${otp} to user ${user._id}`)
  await SendSms.sendOtp(user.phone_number, otp)
}


const _updateRecipientBalance = async (recipient_wallet_id, amount) => {
  let conditions = {wallet_id: recipient_wallet_id};
  try{
    let recipient = await UserMongoDBHelper.getOneOptimized({conditions})
    if(!recipient) throw({
      code: httpStatus.BAD_REQUEST,
      message: 'Invalid Wallet ID'
    })
    let new_balance = recipient.account_balance + amount;
    return UserMongoDBHelper.update({conditions}, {account_balance: new_balance})
  }catch(error) {

  }
}

const _updateTransferStatus = async (transfer_id, status) => {
  return TransMongoDBHelper.update({
    conditions: {_id: transfer_id}
  }, {status})
}

const _getRecipientDetails = async (wallet_id) => {
  try{
    let conditions = {wallet_id};
    return UserMongoDBHelper.getOneOptimized({conditions})
  }catch(error) {
    throw (error)
  }
}

const _getSenderDetails = async (sender_id) => {
  try{
    let conditions = {_id: sender_id};
    return UserMongoDBHelper.getOneOptimized({conditions})
  }catch(error) {
    throw (error)
  }
}






module.exports = {
  makeNewTransfer, completeTransfer, getAllTransfers, getTransferDetails
};
