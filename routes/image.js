const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const imageRouter = express.Router();

imageRouter.use(fileUpload({
    limits: {
        fileSize: 1024 ** 2,
        files: 1
    }
}));

imageRouter.use(express.static(path.join(__dirname, '../.data/static/images')));

imageRouter.use('/thumbnails', express.static(path.join(__dirname, '../.data/static/thumbnails')));

imageRouter.post('/upload', (req, res) => {
    if (req.files && Object.keys(req.files).length !== 0 && req.files.image) {
        if (req.files.image.mimetype === 'image/png') {
            if (!req.files.image.truncated) {
                req.files.image.mv(path.join(__dirname, '../.data/static/images/', req.body.id + '.png'));
                return res.status(200).json();
            }
            return res.invalid('File too large, limit is 1MB');
        }
        return res.invalid('Invalid file type, must be image/png');
      }
      return res.invalid('No files were uploaded');
});

imageRouter.get('*', (req, res) => {
    res.redirect('/assets/placeholder.svg');
});

module.exports = imageRouter;
