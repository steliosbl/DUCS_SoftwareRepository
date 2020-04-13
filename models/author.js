const { checkSchema } = require('express-validator');

// Validation model for Author objects
const schema = {
    id: {
        in: ['param', 'body'], // Id is expected to be a parameter, or in the request body
        isEmail: true, // It must be an email
        escape: true, // It will be escaped, trimmed, and normalized by validator.js
        trim: true,
        normalizeEmail: true
    },

    name: {
        in: ['body'], // Name is expected to be in the request body
        matches: {
            options: /^[a-z ]+$/i, // Only characters allowed are a-z (case insensitive) and spaces
            errorMessage: 'Invalid characters in string'
        },
        notEmpty: true, // It must not be empty
        escape: true, // It will be escaped and trimmed
        trim: true
    }
};

// Validation for individual request types
module.exports = {
    schema: schema, // The schema itself is included

    // GETs must have an Id
    GET: checkSchema({
        id: {
            exists: true,
            ...schema.id
        }
    }),

    // POSTS must have an Id and Name
    POST: checkSchema({
        id: {
            exists: true,
            ...schema.id
        },
        name: {
            exists: true,
            ...schema.name
        }
    }),

    // PUTs must have an Id, and optionally can have a name
    PUT: checkSchema({
        id: {
            exists: true,
            ...schema.id
        },
        name: {
            optional: true,
            ...schema.name
        }
    })
};
