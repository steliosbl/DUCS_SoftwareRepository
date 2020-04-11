module.exports = (req, res, next) => {
    if (req.query.id) {
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.query.id
            });

        if (!res.program.value()) {
            return res.respond.notfound();
        }
    }

    next();
};
