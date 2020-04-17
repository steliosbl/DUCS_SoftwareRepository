const { checkSchema } = require('express-validator');

const { schema: author } = require('./author');

// Validation model for Program objects
const schema = {
    id: {
        in: ['body', 'query'], // Id is expected to be either in the query string or the request body
        escape: true, // It will be escaped and trimmed
        trim: true,
        matches: {
            options: /^[a-zA-Z0-9_-]*$/i,
            errorMessage: 'Invalid characters in string'
        },
        isLength: { // It must be exactly 21 characters in length
            options: {
                min: 21,
                max: 21
            },
            errorMessage: 'Invalid length'
        }
    },
    authorId: {
        in: ['body', 'query'], // AuthorId is expected to be either in the query string or the request body
        ...author.id
    },
    description: {
        in: ['body'], // Description is expected to be in the request body
        escape: true, // It will be escaped and trimmed
        trim: true
    }
};

// Validation for individual request types
module.exports = {
    schema: schema, // The schema itself is included

    // GETs can optionally have an Id or an authorId (or neither)
    GET: checkSchema({
        id: {
            optional: true,
            ...schema.id
        },
        authorId: {
            optional: true,
            ...schema.authorId
        }
    }),

    // POSTs must have a sessionId and a description
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

    // PUTs must have an Id and a sessionId, and can optionally have an authorId or a description
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

    // Deletes must have a sessionId and an Id
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
