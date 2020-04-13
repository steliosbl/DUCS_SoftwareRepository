var HttpStatus = require('http-status-codes');

module.exports = async (err, req, res, next) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        errors: [err]
    });
};
