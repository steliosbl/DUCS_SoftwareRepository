const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
var HttpStatus = require('http-status-codes');

const validate = require('../models/image');
const reportValidationErrors = require('../middleware/reportValidationErrors');
const checkSessionIdValid = require('../middleware/checkSessionIdValid');

const imageRouter = express.Router();

imageRouter.use(fileUpload({
    limits: {
        fileSize: 1024 ** 2,
        files: 1
    }
}));

imageRouter.use(express.static(path.join(__dirname, '../.data/static/images'), {
    extensions: ['png']
}));

imageRouter.post('/', validate.POST, reportValidationErrors, checkSessionIdValid, (req, res) => {
    const program = req.app.db.get('programs')
        .find({
            id: req.body.id
        }).value();

    if (program) {
        if (req.body.sessionId === program.authorId) {
            if (req.files && Object.keys(req.files).length !== 0 && req.files.image) {
                if (req.files.image.mimetype === 'image/png') {
                    if (!req.files.image.truncated) {
                        req.files.image.mv(path.join(__dirname, '../.data/static/images/', req.body.id + '.png'));
                        return res.status(HttpStatus.OK)
                            .json();
                    }
                    return res.status(HttpStatus.REQUEST_TOO_LONG)
                        .json({
                            errors: ['File too large, limit is 1MB']
                        });
                }
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    errors: ['Invalid file type, must be image/png']
                });
            }
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                errors: ['No files were uploaded']
            });
        }
        return res.status(HttpStatus.FORBIDDEN).json({
            errors: ['User does not own program']
        });
    }
    return res.status(HttpStatus.NOT_FOUND).json({
        errors: ['Id does not match an existing program']
    });
});

module.exports = imageRouter;
