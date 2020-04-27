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

// GET at root path (of this router)
// Request (query) is validated before being processed
programRouter.get('/', validate.GET, reportValidationErrors, getProgramFrom('query'), (req, res) => {
    var value = {};

    // The middleware attempts to get the program from the query by Id
    // If there is an Id in the query and the program is found, respond with its data
    if (res.program) {
        value = [res.program.value()];
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

    // Respond with 200-Ok and whatever data has been chosen
    return res.status(HttpStatus.OK)
        .json(value);
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
    // Assign the new data from the body to the object in the database, and update the modificatio ndate
    res.program.assign({
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
