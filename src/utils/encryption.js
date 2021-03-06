const jwt = require('jsonwebtoken');
const { logger } = require('.');

if (
  !process.env.TOKEN_SECRET
  || !process.env.ACCESS_TOKEN_EXPIRY
  || !process.env.ACCESS_TOKEN_ALGO
  || !process.env.REFRESH_TOKEN_EXPIRY
  || !process.env.REFRESH_TOKEN_ALGO
) {
  logger.error('Please set JWT ENV variables');
  process.exit(-1);
}

const createAccessToken = data => jwt.sign(data, process.env.TOKEN_SECRET, {
  algorithm: process.env.ACCESS_TOKEN_ALGO,
});

const decryptAccessToken = token => jwt.decode(token, process.env.TOKEN_SECRET, {
  algorithm: process.env.ACCESS_TOKEN_ALGO,
});

const createRefreshToken = data => jwt.sign(data, process.env.TOKEN_SECRET, {
  expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  algorithm: process.env.REFRESH_TOKEN_ALGO,
});

const decryptRefreshToken = token => jwt.decode(token, process.env.TOKEN_SECRET, {
  expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  algorithm: process.env.REFRESH_TOKEN_ALGO,
});

module.exports = {
  createAccessToken,
  decryptAccessToken,
  createRefreshToken,
  decryptRefreshToken,
};
