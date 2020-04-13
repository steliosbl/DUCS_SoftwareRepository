const HttpStatus = require('http-status-codes');

// This middleware is used by the app globally
// It rejects any incoming requests with content-type other than JSON
// If such a request comes in, it responds with error 400-Bad Request

module.exports = (req, res, next) => {
    // Get the content-type header from the request
    var contype = req.headers['content-type'];

    // If it is not application/json
    if (!contype || contype.indexOf('application/json') !== 0) {
        // Respond with error 400-Bad Request
        return res.status(HttpStatus.BAD_REQUEST).json({
            errors: ['Incorrect Content-Type']
        });
    }

    next();
};
