class BaseError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = BaseError;
