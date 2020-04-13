const express = require('express');
const shortid = require('shortid');
var HttpStatus = require('http-status-codes');

const validateProgram = require('../models/program');
const validate = require('../middleware/validate');

const programRouter = express.Router();

const checkSessionIdValid = require('../middleware/checkSessionIdValid');
const getProgramFromQuery = require('../middleware/getProgramFromQuery');

programRouter.get('/', validateProgram.GET, validate, getProgramFromQuery, (req, res) => {
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

programRouter.post('/', validateProgram.POST, validate, checkSessionIdValid, (req, res) => {
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

programRouter.put('/', validateProgram.PUT, validate, checkSessionIdValid, getProgramFromQuery, (req, res) => {
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

programRouter.delete('/', validateProgram.DELETE, validate, checkSessionIdValid, getProgramFromQuery, (req, res) => {
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
