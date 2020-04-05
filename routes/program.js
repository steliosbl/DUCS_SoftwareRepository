const express = require('express');
const shortid = require('shortid');

const programRouter = express.Router();

programRouter.get('/', (req, res) => {
    const all = req.app.db
        .get('programs')
        .value();

    return res.status(200).json(all);
});

programRouter.post('/', (req, res) => {
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

programRouter.put('/:id', (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.program.value());

    if (validRequest) {
        if (req.body.author === res.program.author) {
            res.program.assign(req.body)
            .write();

            return res.status(200).json(res.program.value());
        }

        return res.status();
    }

    return res.respond.invalid('Invalid request body');
});

programRouter.delete('/:id', (req, res) => {
    const resp = req.app.db
        .get('programs')
        .remove({
            id: req.params.id
        })
        .write();

    return res.status(200).json(resp);
});

module.exports = programRouter;
