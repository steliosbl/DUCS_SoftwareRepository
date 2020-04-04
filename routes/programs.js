const express = require('express');
const shortid = require('shortid');

// Constants used for responses
const NOTFOUND = {
    error: '404'
};
const INVALID = {
    error: '400'
};

const programsRouter = express.Router();

programsRouter.get('/', (req, res) => {
    const all = req.app.get('db')
        .get('programs')
        .value();

    res.status(200).send(all);
});

programsRouter.post('/', (req, res) => {
    const newProgram = {
        id: shortid.generate(),
        date: new Date(Date.now()).toISOString(),
        ...req.body
    };

    req.app.get('db')
        .get('programs')
        .push(newProgram)
        .write();

    res.status(200).send(newProgram);
});

programsRouter.all('/:id', (req, res, next) => {
    if (shortid.isValid(req.params.id)) {
        res.program = req.app.get('db')
            .get('programs')
            .find({
                id: req.params.id
            });

        if (res.program) {
            next();
        } else {
            res.status(404).json(NOTFOUND);
        }
    } else {
        res.status(400).json(INVALID);
    }
});

programsRouter.get('/:id', (req, res) => {
    res.status(200).send(res.program.value());
});

programsRouter.put('/:id', (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.program.value());

    if (validRequest) {
        res.program.assign(req.body)
            .write();

        res.status(200).send(res.program.value());
    } else {
        res.status(400).send(INVALID);
    }
});

programsRouter.delete('/:id', (req, res) => {
    const resp = req.app.get('db')
        .get('programs')
        .remove({
            id: req.params.id
        })
        .write();

    res.status(200).send(resp);
});

module.exports = programsRouter;
