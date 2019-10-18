const mongo = require('../../db/mongodb')
const { hashPayload, jwt } = require('../../utils');
const mongoDBHelper = require('../../lib/mongoDBHelper');
const userModel = require('./users.models');
const {_generateRandomString} = require('../../lib/helper')
const {hashPassword, comparePassword, hashPin} = require('../../lib/passwordHelper')
const {createAccessToken} = require('../../utils/encryption')
const {logger} = require('../../utils')
const httpStatus = require('../../constants/httpStatus')
const responseMessages =  require('../../constants/responseMessages')

const UsersMongoDBHelper = new mongoDBHelper(mongo, userModel);

const createNewUser = async (body) => {
  try{
    let wallet_id = await _genUniqueWalletId();
    let new_user = {...body, wallet_id};
    let hashed_user = await hashPassword(new_user);
    hashed_user = await hashPin(hashed_user)
    console.log({hashed_user})

    let saved_user = await UsersMongoDBHelper.save(hashed_user);
    logger.info(`Created User with ID ${saved_user._id}`)

    let token_data = {
      user_id: saved_user._id
    }

    let token = createAccessToken(token_data);

    return {token, user:saved_user}
  }catch(error){
 
    logger.info(`Error Creating User err = ${error}`)
    if(error.code === 11000){
      console.log(1111, Object.keys(error), {aaaa: error.index, bbb: error.name})
      throw ({
        code: httpStatus.CONFLICT,
        message: 'Email or UserName is Already in use by another user'
      })
    }
    console.log(222)
    throw (error)
  }
}

const _genUniqueWalletId = async () => {
  let wallet_id = _generateRandomString(12);
  try{
    let existing_user = await UsersMongoDBHelper.getOneOptimized({conditions: {wallet_id}});
    if(existing_user) return genUniqueWalletId();
    return Promise.resolve(wallet_id);
  }catch(error){
    Promise.reject(error)
  }
}

const loginUser = async (body) => {
  try {
    
    let conditions = {email: body.email}
    let user = await UsersMongoDBHelper.getOneOptimized({conditions});
    if(!user) throw ({
      code: httpStatus.NOT_FOUND,
      message: responseMessages.userDoesNotExist
    })

    let passwordIsMatch = await comparePassword(user, body.password);
    if(!passwordIsMatch) throw({
      code: httpStatus.NOT_FOUND,
      message: responseMessages.userDoesNotExist
    })
    let token_data = {user_id: user._id}
    let token = createAccessToken(token_data);

    return {token, user}
  }catch(error){
    console.log({error})
    throw (error)
  }
}

const getUserDetails = async (_id) => {
  let conditions = {_id};
  return UsersMongoDBHelper.getOneOptimized({conditions});
}



module.exports = {
  createNewUser, loginUser, getUserDetails
};
