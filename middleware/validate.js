const { validationResult } = require('express-validator');
var HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({
    [err.param]: err.msg
  }));

  return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    errors: extractedErrors
  });
};
