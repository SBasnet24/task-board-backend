const API_ERROR_MSG = require('./apiErrorMessage');
const Constants = require('../constants/constants');
const HTTP_STATUS_CODES = require('../constants/httpErrorCode');
const APIError = require('./apiError');
const ValidationError = require('./validationError');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER;
  err.message = err.message || API_ERROR_MSG.SOMETHING_WENT_WRONG;

  // Joi Validation errors
  if (err.isJoi) {
    return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
      type: 'Validation Error',
      errors:
        err.details &&
        err.details.map((_err) => ({
          message: _err.message,
          param: _err.path.join('.'),
        })),
    });
  }

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      type: Constants.error,
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      type: Constants.error,
      errors: err.details,
    });
  }

  return res.status(err.statusCode).json({
    type: Constants.error,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
