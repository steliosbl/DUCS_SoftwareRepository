const schema = require('../program');
const { checkSchema } = require('express-validator');
const { authorMustExist } = require('../commonFunctions');

module.exports = {
    ALL: checkSchema({
        id: {
            optional: true,
            ...schema.id
        }
    }),

    GET: checkSchema({
        id: {
            optional: true,
            ...schema.id
        }
    }),

    POST: checkSchema({
        sessionId: {
            exists: true,
            ...schema.authorId,
            custom: authorMustExist
        },
        authorId: {
            exists: true,
            ...schema.authorId,
            custom: authorMustExist
        },
        description: {
            optional: true,
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
            ...schema.authorId,
            custom: authorMustExist
        },
        authorId: {
            optional: true,
            ...schema.authorId,
            custom: authorMustExist
        },
        description: {
            optional: true,
            ...schema.description
        }
    }),

    DELETE: checkSchema({
        sessionId: {
            exists: true,
            ...schema.authorId,
            custom: authorMustExist
        },
        id: {
            exists: true,
            ...schema.id
        }
    })
};