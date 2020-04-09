const shortid = require('shortid');
const {
    author
} = require('./author');

const program = {
    id: {
        in: ['body'],
        isAlphanumeric: true,
        escape: true,
        trim: true,
        custom: {
            options: (value) => {
                return shortid.isValid(value)
            }
        }
    },
    author: {
        ...author.id
    },
    description: {
        in: ['body'],
        escape: true,
        trim: true
    }
};

const programSchema = {
    POST: {
        author: {
            exists: true,
            ...program.author
        },
        description: {
            exists: true,
            ...program.description
        }
    },
    PUT: {
        id: {
            optional: true,
            ...program.id
        },
        author: {
            optional: true,
            ...program.author
        },
        description: {
            optional: true,
            ...program.description
        }
    }
};

module.exports = programSchema;
