const { schema: author } = require('./author');
const { schema: program } = require('./program');
const { checkSchema } = require('express-validator');

module.exports = {
    POST: checkSchema({
        sessionId: {
            exists: true,
            ...author.id
        },
        id: {
            exists: true,
            ...program.id
        }
    })
};
