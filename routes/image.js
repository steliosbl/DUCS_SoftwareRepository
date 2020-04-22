const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const HttpStatus = require('http-status-codes');

// Import validation dependencies
const validate = require('../models/image');
const reportValidationErrors = require('../middleware/reportValidationErrors');

// Import middleware
const getProgramFrom = require('../middleware/getProgramFrom');
const checkSessionId = require('../middleware/checkSessionId');

// Initialize router
const imageRouter = express.Router();

// Add file upload settings
imageRouter.use(fileUpload({
    limits: {
        fileSize: 1024 ** 2, // File size limit is 1MB
        files: 1 // Only one file is allowed to be uploaded at a time
    }
}));

// Add static directory to this path, with only .png images allowed to be accessed
imageRouter.use(express.static(path.join(__dirname, '../.data/static/images'), {
    extensions: ['png']
}));

imageRouter.get('/:id', validate.GET, reportValidationErrors, getProgramFrom('params'), (req, res) => {
    res.status(HttpStatus.OK)
    .sendFile('placeholder.svg', {
      root: path.join(__dirname, '../public/assets')
    });
});

// POST at root path
// Request body is validated before being processed
imageRouter.post('/', validate.POST, reportValidationErrors, getProgramFrom('body'), checkSessionId, (req, res) => {
    // If a file has been attached under the key 'image'
    if (req.files && Object.keys(req.files).length !== 0 && req.files.image) {
        // If the file is of type .png
        if (req.files.image.mimetype === 'image/png') {
            // If the file has not been truncated due to being over the limit
            if (!req.files.image.truncated) {
                // Accept the file and move it to the data directory, renaming it to {program Id}.png
                req.files.image.mv(path.join(__dirname, '../.data/static/images/', req.body.id + '.png'));

                // Respond with 200-Ok
                return res.status(HttpStatus.OK)
                    .json();
            }

            // Else, respond with error 413-Request Too Long
            return res.status(HttpStatus.REQUEST_TOO_LONG)
                .json({
                    errors: ['File too large, limit is 1MB']
                });
        }

        // Else, respond with error 422-Unprocessable Entity
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            errors: ['Invalid file type, must be image/png']
        });
    }

    // Else, respond with error 422-Unprocessable Entity
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        errors: ['No files were uploaded']
    });
});

module.exports = imageRouter;
