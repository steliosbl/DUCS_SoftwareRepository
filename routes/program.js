const express = require('express');
const idGenerator = require('../idGenerator');
const HttpStatus = require('http-status-codes');

// Import validation dependencies
const validate = require('../models/program');
const reportValidationErrors = require('../middleware/reportValidationErrors');

// Import middleware
const checkSessionId = require('../middleware/checkSessionId');
const getProgramFrom = require('../middleware/getProgramFrom');

// Initialize router
const programRouter = express.Router();

// Set JSON encoding
programRouter.use(express.json());

// GET at root path (of this router)
// Request (query) is validated before being processed
programRouter.get('/', validate.GET, reportValidationErrors, getProgramFrom('query'), (req, res) => {
    var value;

    // The middleware attempts to get the program from the query by Id
    // If there is an Id in the query and the program is found, respond with its data
    if (res.program) {
        value = [res.program.value()];
    } else if (req.query.q) {
        // If the q query param exists then this is a search
        value = [];

        // First search for an exact Id match
        const idSearch = req.app.db
            .get('programs')
            .find({
                id: req.query.q
            });

        // Then search for an exact author match
        var authorSearch = req.app.db
            .get('programs')
            .filter(prog => {
                return prog.authorId === req.query.q;
            }).value();

        if (authorSearch.length === 0) {
            authorSearch = undefined;
        }

        // Finally, search for a partial title match
        const titleSearch = req.app.db
            .get('programs')
            .filter(prog => {
                return prog.title.includes(req.query.q);
            });

        // Make sure value is always an array even if there is only one match
        value = [].concat(idSearch.value() ||
            authorSearch ||
            titleSearch.value() || []);

    } else {
        // If there are no query parameters, then respond with all program data
        value = req.app.db
            .get('programs')
            .value();
    }

    // Add authors to programs
    value.forEach(program => {
        program.author = req.app.db
            .get('authors')
            .find({
                id: program.authorId
            }).value();
    });

    // Paginate results if start/stop query params are present
    var start = req.query.start;
    var stop = req.query.stop;

    // If either is defined
    if (start || stop) {
        // If both are defined and start is greater than stop
        if (start && stop && start > stop) {
            // Swap them
            [start, stop] = [stop, start];
        }

        // Cap both at value.length
        if (start > value.length) {
            start = value.length;
        }

        if (stop > value.length) {
            stop = value.length;
        }
    } else {
        // Otherwise set default values
        start = 0;
        stop = value.length + 1;
    }

    value = value.slice(start, stop);

    // If there is any data
    if (value) {
        // Respond with 200-Ok and whatever data has been chosen
        return res.status(HttpStatus.OK)
            .json(value);
    } else {
        return res.status(HttpStatus.NOT_FOUND)
            .json([]);
    }
});

// POST at root path
// Request body is validated before being processed
programRouter.post('/', validate.POST, reportValidationErrors, (req, res) => {
    // Check if the author specified by the sessionId exists
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.sessionId
        }).value());

    // If the author exists, create and write the new program object to the database
    if (authorExists) {
        const date = new Date(Date.now()).toISOString();
        const newProgram = {
            id: idGenerator(),
            title: req.body.title,
            creationDate: date,
            modificationDate: date,
            authorId: req.body.sessionId,
            description: req.body.description
        };

        req.app.db
            .get('programs')
            .push(newProgram)
            .write();

        // Respond with 201-Created and the new program object
        return res.status(HttpStatus.CREATED)
            .json(newProgram);
    }

    // Else, respond with error 424-Failed Dependency
    return res.status(HttpStatus.FAILED_DEPENDENCY).json({
        errors: ['SessionId does not correspond to a registered user']
    });
});

// PUT at root path
// Request body is validated before being processed
// The middleware attempts to get the program being edited from the query Id
// The middleware verifies the sessionId given in the request body
programRouter.put('/', validate.PUT, reportValidationErrors, getProgramFrom('query'), checkSessionId, (req, res) => {
    // If the authorId is being edited
    if (req.body.authorId) {
        // Check that the new author exists
        const authorExists = Boolean(req.app.db
            .get('authors')
            .find({
                id: req.body.authorId
            }).value());

        if (!authorExists) {
            // If not, respond with error 424-Failed Dependency
            return res.status(HttpStatus.FAILED_DEPENDENCY).json({
                errors: ['SessionId does not correspond to a registered user']
            });
        }
    }

    // Assign the new data from the body to the object in the database, and update the modificatio ndate
    res.program.assign({
        title: req.body.title || res.program.title,
        authorId: req.body.authorId || res.program.authorId,
        description: req.body.description || res.program.description,
        modificationDate: new Date(Date.now()).toISOString()
    }).write();

    // Respond with 200-Ok and the new data
    return res.status(HttpStatus.OK)
        .json(res.program.value());
});

// DELETE at root path
// Request body is validated before being processed
// The middleware attempts to get the program being edited from the query Id
// The middleware verifies the sessionId given in the request body
programRouter.delete('/', validate.DELETE, reportValidationErrors, getProgramFrom('query'), checkSessionId, (req, res) => {
    // Delete the program from the database
    const resp = req.app.db
        .get('programs')
        .remove({
            id: req.query.id
        }).write();

    // Respond with 200-Ok and the database's response
    return res.status(HttpStatus.OK)
        .json(resp);
});

module.exports = programRouter;
