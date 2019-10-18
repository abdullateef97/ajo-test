const sendResponse = require('./sendResponse');
const logger = require('./logger');
const HttpStatus = require('../constants/httpStatus')

function handleCustomThrow(res, error) {
  logger.log('error', error);
  if (error.parent && error.parent.code === 'ER_DUP_ENTRY') {
    return sendResponse(res, 409, {}, 'Duplicate entry');
  }
  switch(error.code){
    case HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND:
      return sendResponse(res, error.code, {}, error.msg || error.message);
    default:
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {}, 'Something went wrong');       
  }
}

module.exports = handleCustomThrow;
