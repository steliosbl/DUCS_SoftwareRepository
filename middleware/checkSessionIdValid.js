var HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.sessionId
        }).value());

    if (!authorExists) {
        return res.status(HttpStatus.FAILED_DEPENDENCY).json({
            errors: ['SessionId does not correspond to a registered user']
        });
    }

    next();
};
