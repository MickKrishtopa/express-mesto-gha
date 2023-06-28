const httpConstants = require('http2').constants;
const statusCodes = require('http').STATUS_CODES;

class ConflictError extends Error {
  constructor(message) {
    super();
    this.message = `${message}. ${statusCodes[httpConstants.HTTP_STATUS_CONFLICT]}`;
    this.statusCode = httpConstants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
