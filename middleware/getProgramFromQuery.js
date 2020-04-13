var HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    if (req.query.id) {
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.query.id
            });

        if (!res.program.value()) {
            return res.status(HttpStatus.NOT_FOUND).json({
                errors: ['Program with specified Id not found']
            });
        }
    }

    next();
};
