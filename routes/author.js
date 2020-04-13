const express = require('express');
const validateAuthor = require('../models/author');
const validate = require('../middleware/validate');
var HttpStatus = require('http-status-codes');

const authorRouter = express.Router();

authorRouter.post('/', validateAuthor.POST, validate, (req, res) => {
    const idAvailable = !req.app.db
        .get('authors')
        .find({
            id: req.body.id
        }).value();

    if (idAvailable) {
        const newAuthor = {
            id: req.body.id,
            name: req.body.name,
            registrationDate: new Date(Date.now())
                .toISOString()
        };

        req.app.db
            .get('authors')
            .push(newAuthor)
            .write();

        return res.status(HttpStatus.CREATED)
            .json(newAuthor);
    }

    return res.status(HttpStatus.CONFLICT).json({
        errors: ['Id already in use']
    });
});

authorRouter.all('/:id', (req, res, next) => {
    res.author = req.app.db.get('authors')
        .find({
            id: req.params.id
        });

    if (!res.author.value()) {
        return res.status(HttpStatus.NOT_FOUND).json({
            errors: ['Specified Id not found']
        });
    }

    next();
});

authorRouter.get('/:id', (req, res) => {
    return res.status(HttpStatus.OK)
        .json(res.author.value());
});

authorRouter.put('/:id', validateAuthor.PUT, validate, (req, res) => {
    var validRequest = Object.keys(req.body)
        .every(key => key in res.author.value());

    if (validRequest) {
        res.author.assign(req.body)
            .write();

        return res.status(HttpStatus.OK)
            .json(res.author.value());
    }

    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        errors: ['Invalid keys in request body']
    });
});

authorRouter.delete('/:id', (req, res) => {
    return res.status(HttpStatus.FORBIDDEN).json({
        errors: ['They will never be forgotten']
    });
});

module.exports = authorRouter;
