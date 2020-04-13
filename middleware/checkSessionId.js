const HttpStatus = require('http-status-codes');

// This middleware used by routes that expect a sessionId
// When invoked it takes the sessionId from the request body and make sure it corresponds to an existing author in the database, and that author is the one that owns the program
// It must be invoked AFTER the program has been retreived and assigned to res.program

module.exports = (req, res, next) => {
    // Make sure there is a program to check against first
    if (!res.program) {
        throw new Error('checkSessionId has been called without a program to check against. Have you invoked getProgramFrom() first?')
    }

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

    // If the author is found, make sure the sessionId corresponds to res.program's authorId
    if (req.body.sessionId !== res.program.value().authorId) {
        return res.status(HttpStatus.FORBIDDEN).json({
            errors: ['User does not own program']
        });
    }

    next();
};
