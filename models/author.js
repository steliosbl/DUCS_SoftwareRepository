const { checkSchema } = require('express-validator');

const schema = {
    id: {
        in: ['param', 'body'],
        isEmail: true,
        escape: true,
        trim: true,
        normalizeEmail: true
    },

    name: {
        in: ['body'],
        matches: {
            options: /^[a-z ]+$/i, // Only characters allowed are a-z (case insensitive) and spaces
            errorMessage: 'Invalid characters in string'
        },
        notEmpty: true,
        escape: true,
        trim: true
    }
};

module.exports = {
    schema: schema,
    GET: checkSchema({
        id: {
            exists: true,
            ...schema.id
        }
    }),

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
