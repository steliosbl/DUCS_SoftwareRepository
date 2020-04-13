const HttpStatus = require('http-status-codes');

// This middleware is used by routes that expect a program Id in the query string
// When invoked it takes the Id from the request body and attempts to get the program from the database
// If it exists, it is passed to res.program

module.exports = (req, res, next) => {
    // If the query has Id parameter
    if (req.query.id) {
        // Attempt to get the corresponding program from the databse
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.query.id
            });

        // If the program is not found, respond with error 404-Not Found
        if (!res.program.value()) {
            return res.status(HttpStatus.NOT_FOUND).json({
                errors: ['Program with specified Id not found']
            });
        }
    }

    next();
};
