const schema = require('../program');
const { checkSchema } = require('express-validator');

module.exports = {
    GET: checkSchema({
        id: {
            optional: true,
            ...schema.id
        }
    }),

    POST: checkSchema({
        sessionId: {
            exists: true,
            ...schema.authorId
        },
        description: {
            exists: true,
            ...schema.description
        }
    }),

    PUT: checkSchema({
        id: {
            exists: true,
            ...schema.id
        },
        sessionId: {
            exists: true,
            ...schema.authorId
        },
        authorId: {
            optional: true,
            ...schema.authorId
        },
        description: {
            optional: true,
            ...schema.description
        }
    }),

    DELETE: checkSchema({
        sessionId: {
            exists: true,
            ...schema.authorId
        },
        id: {
            exists: true,
            ...schema.id
        }
    })
};