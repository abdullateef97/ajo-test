const sendResponse = require('./sendResponse');
const logger = require('./logger');
const HttpStatus = require('../constants/httpStatus')

function handleCustomThrow(res, error) {
  console.log('customErr', JSON.stringify(error))
  logger.error(`'error1', ${JSON.stringify(error)}`);
  switch(error.code){
    case HttpStatus.BAD_REQUEST:
    case HttpStatus.UNAUTHORIZED:
    case HttpStatus.FORBIDDEN:
    case HttpStatus.NOT_FOUND:
    case HttpStatus.CONFLICT:
      console.log({errorCase: error})
      return sendResponse(res, error.code, {}, error.msg || error.message);
    default:
      return sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {}, error.msg || error.message || 'Something went wrong');       
  }
}

module.exports = handleCustomThrow;
