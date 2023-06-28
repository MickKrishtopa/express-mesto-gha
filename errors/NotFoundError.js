const httpConstants = require('http2').constants;
const statusCodes = require('http').STATUS_CODES;

class NotFoundError extends Error {
  constructor() {
    super();
    this.message = statusCodes[httpConstants.HTTP_STATUS_NOT_FOUND];
    this.statusCode = httpConstants.HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
