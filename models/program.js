const shortid = require('shortid');
const author = require('./author');

module.exports = {
    id: {
        in: ['query'],
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
