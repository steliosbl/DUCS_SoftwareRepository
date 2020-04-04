const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const imagesRouter = express.Router();

imagesRouter.use(fileUpload({
    limits: {
        fileSize: 1024 ** 2,
        files: 1,
    },
}));

imagesRouter.use(express.static(path.join(__dirname, '../.data/static/images')));

imagesRouter.use('/thumbnails', express.static(path.join(__dirname, '../.data/static/thumbnails')));

imagesRouter.post('/upload', (req, res) => {
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

imagesRouter.get('*', (req, res) => {
    res.redirect('/assets/placeholder.svg');
});

module.exports = imagesRouter;