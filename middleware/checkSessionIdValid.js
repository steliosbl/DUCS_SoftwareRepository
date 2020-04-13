const HttpStatus = require('http-status-codes');

// This middleware used by routes that expect a sessionId
// When invoked it takes the sessionId from the request body and make sure it corresponds
// to an existing author in the database

module.exports = (req, res, next) => {
    // Try to get the author from the database
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.sessionId
        }).value());

    // If it is not found, respond with error 424-Failed Dependency
    if (!authorExists) {
        return res.status(HttpStatus.FAILED_DEPENDENCY).json({
            errors: ['SessionId does not correspond to a registered user']
        });
    }

    next();
};
