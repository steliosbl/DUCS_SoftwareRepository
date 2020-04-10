const shortid = require('shortid');
const author = require('./author');

module.exports = {
    id: {
        in: ['body', 'param', 'query'],
        isAlphanumeric: true,
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
