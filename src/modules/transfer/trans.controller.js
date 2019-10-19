const {validateSchema} = require('../../lib/joiHelper')
const {TransferValidatorModel, CompleteTransferValidatorModel} = require('./trans.validator.models')
const {
  makeNewTransfer,
  completeTransfer,
  getAllTransfers,
  getTransferDetails
} = require('./trans.services');
const { sendResponse, handleCustomError } = require('../../utils');
const ResponseMessages = require('../../constants/responseMessages');
const httpStatus = require('../../constants/httpStatus')

async function makeNewTransferController(req, res) {
  try {
    let {body, userId} = req;
    await validateSchema(res, TransferValidatorModel, body);
    let response = await makeNewTransfer(body, userId)
    return sendResponse(res, httpStatus.CREATED, response, 'Transfer Initiated' )
  } catch (err) {
    console.log({errCont: JSON.stringify(err), kkk: typeof err, kkll: Object.keys(err), kkkjj: JSON.stringify(err)})
    return handleCustomError(res, err);

  }
}

async function completeTransferController(req, res) {
  try {
    let {body, userId, params: {trans_id}} = req
    await validateSchema(res, CompleteTransferValidatorModel, body);
    let response = await completeTransfer(body.otp, userId, trans_id)
    return sendResponse(res, httpStatus.OK, {}, 'Transfer Completed')
  } catch (err) {
    return handleCustomError(res, err);
  }
}

async function getAllTransfersController(req, res) {
  try {
    let {userId} = req;
    let response = await getAllTransfers(userId);

    return sendResponse(res, httpStatus.OK, response, 'All Transfers')
  }catch(error) {
    return handleCustomError(res, error)
  }
}


async function getTransferDetailsController(req, res) {
  try {
    let {params: {trans_id}} = req;
    let response = await getTransferDetails(trans_id);

    return sendResponse(res, httpStatus.OK, response, 'Transfer Details')
  }catch(error) {
    return handleCustomError(res, error)
  }
}

module.exports = {
  makeNewTransferController,
  completeTransferController,
  getAllTransfersController,
  getTransferDetailsController
};
