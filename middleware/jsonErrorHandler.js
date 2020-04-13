const HttpStatus = require('http-status-codes');

// This middleware is used by the app globally
// It passes internal errors to the client in JSON form, instead of the default HTML

module.exports = async (err, req, res, next) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        errors: [err]
    });
};
