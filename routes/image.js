const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const validateImage = require('../models/image');
const validate = require('../middleware/validate');

const imageRouter = express.Router();

const checkSessionIdValid = require('../middleware/routes/checkSessionIdValid');

imageRouter.use(fileUpload({
    limits: {
        fileSize: 1024 ** 2,
        files: 1
    }
}));

imageRouter.use(express.static(path.join(__dirname, '../.data/static/images'), {
    extensions: ['png']
}));

imageRouter.post('/', validateImage.POST, validate, checkSessionIdValid, (req, res) => {
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
                        return res.status(200).json();
                    }
                    return res.respond.tooLarge('File too large, limit is 1MB');
                }
                return res.respond.unprocessable('Invalid file type, must be image/png');
            }
            return res.respond.unprocessable('No files were uploaded');
        }
        return res.respond.forbidden('User does not own program');
    }
    return res.respond.notFound('Id does not match an existing program');
});

module.exports = imageRouter;
