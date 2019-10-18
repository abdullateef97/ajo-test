const { sendResponse, jwt } = require('../utils');
const httpStatus = require('../constants/httpStatus')

async function isAuthenticated(req, res, next) {
  const token = req.header('x-access-token');

  try {
    if (!token) {
      return sendResponse(res, httpStatus.UNAUTHORIZED, { tokenExpired: 0 }, 'Failed to Authenticate');
    }

    const decoded = jwt.decryptAccessToken(token);

    // if everything is good, save to request for use in other routes
    req.userId = decoded.user_id;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, httpStatus.UNAUTHORIZED, { tokenExpired: 1 }, 'Token Expired');
    }
    if (err.name === 'JsonWebTokenError') {
      return sendResponse(res, httpStatus.UNAUTHORIZED, { tokenExpired: 0 }, 'Corrupt Token');
    }
    return sendResponse(res, httpStatus.UNAUTHORIZED, {tokenExpired: 2}, 'Bad Token')
  }
}

module.exports = isAuthenticated;
