const {validateSchema} = require('../../lib/joiHelper')
const {LoginValidatorModel, SignUpValidatorModel} = require('./users.validator.models')
const {
  loginUser,
  createNewUser,
  getUserDetails
} = require('./users.services');
const { sendResponse, handleCustomError } = require('../../utils');
const ResponseMessages = require('../../constants/responseMessages');
const httpStatus = require('../../constants/httpStatus')

async function createNewUserController(req, res) {
  try {
    let {body} = req;
    await validateSchema(res, SignUpValidatorModel, body);
    if(isNaN(body.pin)) return handleCustomError(res, {code: httpStatus.BAD_REQUEST, message: 'Pin Should Be a 4 digit Number'})
    let response = await createNewUser(body);
    return sendResponse(res, httpStatus.CREATED, {...response}, 'User Created' )
  } catch (err) {
    console.log({errCont: JSON.stringify(err), kkk: typeof err, kkll: Object.keys(err), kkkjj: JSON.stringify(err)})
    return handleCustomError(res, err);

  }
}

async function loginUserController(req, res) {
  try {
    let {body} = req;
    await validateSchema(res, LoginValidatorModel, body);

    let response = await loginUser(body)
    return sendResponse(res, httpStatus.OK,  {...response}, 'User Logged In')
  } catch (err) {
    return handleCustomError(res, err);
  }
}

async function getUserDetailsController(req, res) {
  try {
    let {userId} = req;
    let response = await getUserDetails(userId);

    return sendResponse(res, httpStatus.OK, response, 'User Details')
  }catch(error) {
    return handleCustomError(res, error)
  }
}

module.exports = {
  createNewUserController,
  loginUserController,
  getUserDetailsController
};
