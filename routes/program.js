const express = require('express');
const shortid = require('shortid');

const programSchema = require('../models/program');
const validate = require('../middleware/validate');
const { checkSchema } = require('express-validator');

const programRouter = express.Router();

programRouter.get('/', (req, res) => {
    const all = req.app.db
        .get('programs')
        .value();

    return res.status(200).json(all);
});

programRouter.post('/', checkSchema(programSchema.POST), validate, (req, res) => {
    const newProgram = {
        id: shortid.generate(),
        date: new Date(Date.now()).toISOString(),
        ...req.body
    };

    req.app.db
        .get('programs')
        .push(newProgram)
        .write();

    return res.status(200).json(newProgram);
});

programRouter.all('/:id', (req, res, next) => {
    if (shortid.isValid(req.params.id)) {
        res.program = req.app.db
            .get('programs')
            .find({
                id: req.params.id
            });

        if (res.program) {
            next();
        } else {
            return res.respond.notfound();
        }
    }

    return res.respond.invalid('Invalid program id');
});

programRouter.get('/:id', (req, res) => {
    return res.status(200).json(res.program.value());
});

programRouter.put('/:id', checkSchema(programSchema.PUT), validate, (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.author.value());

    if (validRequest) {
        if (req.body.author === res.program.author) {
            res.program.assign(req.body)
                .write();

            return res.status(200).json(res.program.value());
        }

        return res.respond.forbidden('User does not own program');
    }

    return res.respond.invalid('Invalid keys in request body');
});

programRouter.delete('/:id', (req, res) => {
    if (req.body.author === res.program.author) {
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
