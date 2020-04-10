const schema = require('../author');
const { checkSchema } = require('express-validator');

module.exports = {
    GET: checkSchema({
        id: {
            in: ['param'],
            exists: true,
            ...schema.id
        }
    }),

    POST: checkSchema({
        id: {
            in: ['body'],
            exists: true,
            ...schema.id
        },
        name: {
            in: ['body'],
            exists: true,
            ...schema.name
        }
    }),

    PUT: checkSchema({
        name: {
            in: ['body'],
            optional: true,
            ...schema.name
        }
    })
};
