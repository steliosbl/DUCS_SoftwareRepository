const schema = require('../author');
const { checkSchema } = require('express-validator');

module.exports = {
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
