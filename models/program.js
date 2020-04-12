const shortid = require('shortid');
const { checkSchema } = require('express-validator');

const { schema: author } = require('./author');

const schema = {
    id: {
        in: ['body', 'query'],
        escape: true,
        trim: true,
        custom: {
            options: value => shortid.isValid(value)
        }
    },
    authorId: {
        in: ['body', 'param'],
        ...author.id
    },
    description: {
        in: ['body'],
        escape: true,
        trim: true
    }
};

module.exports = {
    schema: schema,

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
