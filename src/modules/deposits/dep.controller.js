const {validateSchema} = require('../../lib/joiHelper')
const {InitiateDepositValidatorModel} = require('./dep.validator.models')
const {
  initiateNewDeposit,
  verifyDeposit,
} = require('./dep.services');
const { sendResponse, handleCustomError } = require('../../utils');
const ResponseMessages = require('../../constants/responseMessages');
const httpStatus = require('../../constants/httpStatus')

async function initiateNewDepController(req, res) {
  try {
    let {body} = req;
    await validateSchema(res, InitiateDepositValidatorModel, body);
    let response = await initiateNewDeposit(body, req.userId);
    return sendResponse(res, httpStatus.CREATED, {...response}, 'Deposit Initiated' )
  } catch (err) {
    console.log({errCont: JSON.stringify(err), kkk: typeof err, kkll: Object.keys(err), kkkjj: JSON.stringify(err)})
    return handleCustomError(res, err);

  }
}

async function verifyDepositController(req, res) {
  try {

    let response = await verifyDeposit(req.query.reference)
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
  initiateNewDepController,
  verifyDepositController
};
