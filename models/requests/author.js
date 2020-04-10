const schema = require('../author');
const { checkSchema } = require('express-validator');
const { authorMustExist } = require('../commonFunctions');

module.exports = {
    GET: checkSchema({
        id: {
            exists: true,
            ...schema.id
        }
    }),

    POST: checkSchema({
        id: {
            exists: true,
            ...schema.id,
            custom: {
                ...authorMustExist,
               negated: true,
               errorMessage: 'Id already in use'
            }
        },
        name: {
            exists: true,
            ...schema.name
        }
    }),

    PUT: checkSchema({
        id: {
            exists: true,
            ...schema.id,
            custom: authorMustExist
        },
        name: {
            optional: true,
            ...schema.name
        }
    })
};
