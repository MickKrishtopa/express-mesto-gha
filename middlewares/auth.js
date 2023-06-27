/* eslint-disable consistent-return */
const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;
const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    return verifyToken(authorization).then((check) => {
      if (!check) {
        return res.status(httpConstants.HTTP_STATUS_UNAUTHORIZED).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED]}`,
        });
      }

      req.user = check;
      next();
    });
  } catch (err) {
    return res.status(httpConstants.HTTP_STATUS_UNAUTHORIZED).send({
      message: `${statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED]}`,
    });
  }
};

module.exports = { auth };
