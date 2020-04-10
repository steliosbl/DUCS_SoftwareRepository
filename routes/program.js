const express = require('express');
const shortid = require('shortid');

const validateProgram = require('../models/requests/program');
const validate = require('../middleware/validate');

const programRouter = express.Router();

programRouter.get('/', validateProgram.GET, validate, (req, res) => {
    if (req.query.id) {
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.query.id
            });

        if (res.program.value()) {
            return res.status(200).json(res.program.value());
        }

        return res.respond.notfound();
    }

    const all = req.app.db
        .get('programs')
        .value();

    return res.status(200).json(all);
});

programRouter.post('/', validateProgram.POST, validate, (req, res) => {
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.authorId
        })
        .value());

    if (authorExists) {
        const newProgram = {
            id: shortid.generate(),
            date: new Date(Date.now()).toISOString(),
            authorId: req.body.sessionId,
            description: req.body.description
        };

        req.app.db
            .get('programs')
            .push(newProgram)
            .write();

        return res.status(201).json(newProgram);
    }

    return res.respond.failedDependency();
});

programRouter.all('/:id', (req, res, next) => {
    if (shortid.isValid(req.params.id)) {
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.params.id
            });

        if (res.program.value()) {
            next();
        } else {
            return res.respond.notfound();
        }
    } else {
        return res.respond.unprocessable('Invalid program id');
    }
});

programRouter.get('/:id', (req, res) => {
    return res.status(200).json(res.program.value());
});

programRouter.put('/:id', validateProgram.PUT, validate, (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.program.value());

    if (validRequest) {
        if (req.body.sessionId === res.program.authorId) {
            res.program.assign(req.body)
                .write();

            return res.status(200).json(res.program.value());
        }

        return res.respond.forbidden('User does not own program');
    }

    return res.respond.unprocessable('Invalid keys in request body');
});

programRouter.delete('/:id', (req, res) => {
    if (req.body.sessionId === res.program.authorId) {
        const resp = req.app.db
        .get('programs')
        .remove({
            id: req.params.id
        })
        .write();

        return res.status(200).json(resp);
    }

    return res.respond.forbiddden('User does not own program');
});

module.exports = programRouter;
