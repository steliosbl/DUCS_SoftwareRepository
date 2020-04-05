const author = {
    id: {
        in: ['body'],
        isAlphanumeric: true,
        escape: true,
        trim: true
    },
    email: {
        in: ['body'],
        isEmail: true,
        escape: true,
        trim: true,
        normalizeEmail: true
    }
};

const authorSchema = {
    POST: {
        id: {
            exists: true,
            ...author.id
        },
        email: {
            exists: true,
            ...author.email
        }
    },
    PUT: {
        id: {
            optional: true,
            ...author.id
        },
        email: {
            optional: true,
            ...author.email
        }
    }
};

module.exports = {
    author: author,
    authorSchema: authorSchema
};
