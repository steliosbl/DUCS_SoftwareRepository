const author = require('../author');
const program = require('../program');
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
