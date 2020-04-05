const author = {
    id: {
        in: ['body'],
        isAlphanumeric: true,
        escape: true,
        trim: true,
        custom: {
            errorMessage: 'Id already in use',
            options: (value, {
                req
            }) => {
                return !req.app.db
                    .get('authors')
                    .find({
                        id: value
                    }).value();
            }
        }
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
