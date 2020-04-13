const express = require('express');
const shortid = require('shortid');
var HttpStatus = require('http-status-codes');

const validate = require('../models/program');
const reportValidationErrors = require('../middleware/reportValidationErrors');
const checkSessionIdValid = require('../middleware/checkSessionIdValid');
const getProgramFromQuery = require('../middleware/getProgramFromQuery');

const programRouter = express.Router();

programRouter.get('/', validate.GET, reportValidationErrors, getProgramFromQuery, (req, res) => {
    var value;

    if (res.program) {
        value = res.program.value();
    } else {
        value = req.app.db
            .get('programs')
            .value();
    }

    return res.status(HttpStatus.OK)
        .json(value);
});

programRouter.post('/', validate.POST, reportValidationErrors, checkSessionIdValid, (req, res) => {
    const date = new Date(Date.now()).toISOString();
    const newProgram = {
        id: shortid.generate(),
        creationDate: date,
        modificationDate: date,
        authorId: req.body.sessionId,
        description: req.body.description
    };

    req.app.db
        .get('programs')
        .push(newProgram)
        .write();

    return res.status(HttpStatus.CREATED)
        .json(newProgram);
});

programRouter.put('/', validate.PUT, reportValidationErrors, checkSessionIdValid, getProgramFromQuery, (req, res) => {
    const old = res.program.value();
    if (req.body.sessionId === old.authorId) {
        res.program.assign({
            description: req.body.description || old.description,
            modificationDate: new Date(Date.now()).toISOString()
        }).write();

        return res.status(HttpStatus.OK)
            .json(res.program.value());
    }

    return res.status(HttpStatus.FORBIDDEN).json({
        errors: ['User does not own program']
    });
});

programRouter.delete('/', validate.DELETE, reportValidationErrors, checkSessionIdValid, getProgramFromQuery, (req, res) => {
    if (req.body.sessionId === res.program.value().authorId) {
        const resp = req.app.db
            .get('programs')
            .remove({
                id: req.query.id
            }).write();

        return res.status(HttpStatus.OK)
            .json(resp);
    }

    return res.status(HttpStatus.FORBIDDEN).json({
        errors: ['User does not own program']
    });
});

module.exports = programRouter;
