const express = require('express');

const authorRouter = express.Router();

function getAuthor (db, id) {
    return db
        .get('authors')
        .find({
            id: id
        });
}

authorRouter.post('/', (req, res) => {
    if (!getAuthor(req.db, req.body.id)) {
        const newAuthor = {
            id: req.body.id,
            email: req.body.email,
            registrationDate: new Date(Date.now()).toISOString()
        };

        req.app.db
            .get('authors')
            .push(newAuthor)
            .write();

        return res.status(200).json(newAuthor);
    }

    return res.respond.conflict('Id already in use');
});

authorRouter.all('/:id', (req, res, next) => {
    res.author = getAuthor(req.db, req.params.id);
    if (res.author) {
        next();
    } else {
        return res.respond.notfound();
    }
});

authorRouter.get('/:id', (req, res) => {
    return res.status(200).json(res.author.value());
});

authorRouter.put('/:id', (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.author.value());

    if (validRequest) {
        res.author.assign(req.body)
            .write();

        return res.status(200).json(res.author.value());
    }

    return res.respond.invalid('Invalid request body');
});

authorRouter.delete('/:id', (req, res) => {
    return res.respond.forbidden('They will never be forgotten');
});
