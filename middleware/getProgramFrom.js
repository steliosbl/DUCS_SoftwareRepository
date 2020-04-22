const HttpStatus = require('http-status-codes');

// This middleware is used by routes that expect a program Id in the query string or in the body
// When invoked it takes the Id from the request and attempts to get the program from the database
// If it exists, it is passed to res.program

module.exports = function (location) {
    return (req, res, next) => {
        // Get the Id from the appropriate place, and throw internal error if the location is not query or body
        var id;
        if (location === 'query') {
            id = req.query.id;
        } else if (location === 'body') {
            id = req.body.id;
        } else if (location === 'params') {
            id = req.params.id;
        } else {
            throw new Error('Cannot get program from {0}. Must be either "query" or "body"'.format(location));
        }

        // If the query/body has Id parameter
        if (id) {
            // Attempt to get the corresponding program from the database
            res.program = req.app.db
                .get('programs')
                .find({
                    id: id
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
};
