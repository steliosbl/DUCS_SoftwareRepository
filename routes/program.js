const express = require('express');
const shortid = require('shortid');

const validateProgram = require('../models/requests/program');
const validate = require('../middleware/validate');

const programRouter = express.Router();

programRouter.all('/', validateProgram.ALL, validate, (req, res, next) => {
    const authorExists = Boolean(req.app.db
        .get('authors')
        .find({
            id: req.body.sessionId
        }).value());

    if (!authorExists) {
        return res.respond.forbidden('SessionId does not correspond to a registered user');
    }

    next();
})

programRouter.get('/', (req, res) => {
    const all = req.app.db
        .get('programs')
        .value();

    return res.status(200).json(all);
});

programRouter.post('/', validateProgram.POST, validate, (req, res) => {
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

    return res.status(201).json(newProgram);
});

programRouter.all('/', validateProgram.ALL, validate, (req, res, next) => {
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
});

programRouter.get('/', (req, res) => {
    return res.status(200).json(res.program.value());
});

programRouter.put('/', validateProgram.PUT, validate, (req, res) => {
    const old = res.program.value();
    if (req.body.sessionId === old.authorId) {
        res.program.assign({
            description: req.body.description || old.description,
            modificationDate: new Date(Date.now()).toISOString()
        }).write();

        return res.status(200).json(res.program.value());
    }

    return res.respond.forbidden('User does not own program');
});

programRouter.delete('/', (req, res) => {
    if (req.body.sessionId === res.program.value().authorId) {
        const resp = req.app.db
            .get('programs')
            .remove({
                id: req.query.id
            }).write();

        return res.status(200).json(resp);
    }

    return res.respond.forbiddden('User does not own program');
});

module.exports = programRouter;
