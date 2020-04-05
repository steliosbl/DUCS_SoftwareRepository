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
            errorMessage: 'Id invalid or already in use',
            options: (value, {
                req
            }) => {
                return shortid.isValid(value) && !req.app.db
                    .get('programs')
                    .find({
                        id: value
                    }).value();
            }
        }
    },
    author: {
        ...author.id,
        custom: {
            errorMessage: 'Author does not exist',
            options: (value, {
                req
            }) => {
                return Boolean(req.app.db
                    .get('authors')
                    .find({
                        id: value
                    }).value());
            }
        }
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
