const httpConstants = require('http2').constants;
const statusCodes = require('http').STATUS_CODES;

class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.message = `${message}. ${statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED]}`;
    this.statusCode = httpConstants.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
