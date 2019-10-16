const sendResponse = require('./sendResponse');
const logger = require('./logger');
const HttpStatus = require('../constants/httpStatus')

function handleCustomThrow(res, error) {
  logger.log('error', error);
  if (error.parent && error.parent.code === 'ER_DUP_ENTRY') {
    return sendResponse(res, 409, {}, 'Duplicate entry');
  }
  if (error.code === HttpStatus.BAD_REQUEST) {
    return sendResponse(res, error.code, {}, error.msg || error.message);
  }
  if (error.code === HttpStatus.UNAUTHORIZED) {
    return sendResponse(res, error.code, {}, error.msg || error.message);
  }
  if (error.code === HttpStatus.FORBIDDEN) {
    return sendResponse(res, error.code, {}, error.msg || error.message);
  }
  if (error.code === HttpStatus.NOT_FOUND) {
    return sendResponse(res, error.code, {}, error.msg || error.message);
  }
  return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {}, 'Something went wrong');
}

module.exports = handleCustomThrow;
