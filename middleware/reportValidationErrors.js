const HttpStatus = require('http-status-codes');
const { validationResult } = require('express-validator');

// This middleware is used by routes that perform validation on the body or query
// It is meant to be invoked AFTER the validation has taken place
// If there are validation errors, it responds with error 422-Unprocessable Entity
// The specific errors are put in the response body in JSON form

module.exports = (req, res, next) => {
    // Get the results of the validation that has already taken place
    const errors = validationResult(req);

    // If there are errors to report
    if (!errors.isEmpty()) {
        // Extract them to this array
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({
            [err.param]: err.msg
        }));

        // Respond with 422-Unprocessable Entity and the errors in the body
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            errors: extractedErrors
        });
    }

    next();
};
