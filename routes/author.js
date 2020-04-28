const express = require('express');
const HttpStatus = require('http-status-codes');

// Import validation dependencies
const validate = require('../models/author');
const reportValidationErrors = require('../middleware/reportValidationErrors');

// Initialize router
const authorRouter = express.Router();

// Set JSON encoding
authorRouter.use(express.json());

// POST at root path (of this router)
// Used to create new authors in the database
// Request body is validated before being processed
authorRouter.post('/', validate.POST, reportValidationErrors, (req, res) => {

    // Check if the given Id is already in use
    const idAvailable = !req.app.db
        .get('authors')
        .find({
            id: req.body.id
        }).value();

    // If the Id is available, create the new Author object
    if (idAvailable) {
        const newAuthor = {
            id: req.body.id,
            name: req.body.name,
            registrationDate: new Date(Date.now())
                .toISOString()
        };

        // Write the new Author to the database
        req.app.db
            .get('authors')
            .push(newAuthor)
            .write();

        // Respond with 201-Created and the new Author object
        return res.status(HttpStatus.CREATED)
            .json(newAuthor);
    }

    // If the Id is in use, respond with error 409-Conflict
    return res.status(HttpStatus.CONFLICT).json({
        errors: ['Id already in use']
    });
});

// All routes with an Id parameter are pre-processed here
// If the Id corresponds to an existing Author in the database, that object is passed to res.author
authorRouter.all('/:id', (req, res, next) => {
    // Attempt to assign the retreived author
    res.author = req.app.db.get('authors')
        .find({
            id: req.params.id
        });

    // If the author was not found, respond with error 404-Not Found
    if (!res.author.value()) {
        return res.status(HttpStatus.NOT_FOUND).json({
            errors: ['Specified Id not found']
        });
    }

    next();
});

// GET at root path with Id parameter
authorRouter.get('/:id', (req, res) => {
    // Respond with 200-Ok and the (already retreived) author object that corresponds to the Id parameter
    return res.status(HttpStatus.OK)
        .json(res.author.value());
});

// PUT at root path with Id parameter
// Request body is validated before being processed
authorRouter.put('/:id', validate.PUT, reportValidationErrors, (req, res) => {
    // If the current user has permission to edit this profile
    if (req.body.sessionId === res.author.value().id) {
        res.author.assign({
            name: req.body.name || res.author.name
        }).write();

        // Respond with 200-Ok and the new data
        return res.status(HttpStatus.OK)
            .json(res.author.value());
    } else {
        // Otherwise, respond with 403-Forbidden
        return res.status(HttpStatus.FORBIDDEN).json({
            errors: ['User does not have permission to edit another profile']
        });
    }
});

// DELETE at root path with Id parameter
authorRouter.delete('/:id', (req, res) => {
    // Always responds with error 403-Forbidden because one cannot simply make someone else disappear
    return res.status(HttpStatus.FORBIDDEN).json({
        errors: ['They will never be forgotten']
    });
});

module.exports = authorRouter;
