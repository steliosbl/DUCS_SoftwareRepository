const { checkSchema } = require('express-validator');

const { schema: author } = require('./author');
const { schema: program } = require('./program');

// Validation model for requests made to the imageRouter
module.exports = {
    // GET must have an id in the params
    GET: checkSchema({
        id: {
            exists: true,
            ...program.id
        }
    }),
    // POSTS must have a program Id
    POST: checkSchema({
        id: {
            exists: true,
            ...program.id
        }
    })
};
