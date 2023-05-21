const API_ERROR_MSG = require('./apiErrorMessage');
const HTTP_STATUS_CODES = require('../constants/httpErrorCode');
const BaseError = require('./baseError');

class APIError extends BaseError {
  constructor(
    statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER,
    message = API_ERROR_MSG.INTERNAL_SERVER_ERROR
  ) {
    super(statusCode, message);
  }
}

module.exports = APIError;
