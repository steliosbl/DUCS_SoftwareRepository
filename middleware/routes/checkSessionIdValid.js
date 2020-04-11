module.exports = (req, res, next) => {
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.sessionId
        }).value());

    if (!authorExists) {
        return res.respond.failedDependency('SessionId does not correspond to a registered user');
    }

    next();
};
