const express = require('express');
const {
    authorSchema
} = require('../models/author');
const validate = require('../middleware/validate');
const {
    checkSchema
} = require('express-validator');

const authorRouter = express.Router();

authorRouter.post('/', checkSchema(authorSchema.POST), validate, (req, res) => {
    const idAvailable = !req.app.db
                .get('authors')
                .find({
                    id: req.body.id
                }).value();

    if (idAvailable) {
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
    res.author = req.app.db.get('authors')
        .find({
            id: req.params.id
        });
    if (res.author) {
        next();
    } else {
        return res.respond.notfound();
    }
});

authorRouter.get('/:id', (req, res) => {
    return res.status(200).json(res.author.value());
});

authorRouter.put('/:id', checkSchema(authorSchema.PUT), validate, (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.author.value());

    if (validRequest) {
        res.author.assign(req.body)
            .write();

        return res.status(200).json(res.author.value());
    }

    return res.respond.unprocessable('Invalid keys in request body');
});

authorRouter.delete('/:id', (req, res) => {
    return res.respond.forbidden('They will never be forgotten');
});

module.exports = authorRouter;
