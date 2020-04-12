module.exports = {
    id: {
        in: ['param', 'body'],
        isEmail: true,
        escape: true,
        trim: true,
        normalizeEmail: true
    },

    name: {
        in: ['body'],
        matches: {
            options: /^[a-z ]+$/i, // Only characters allowed are a-z (case insensitive) and spaces
            errorMessage: 'Invalid characters in string'
        },
        notEmpty: true,
        escape: true,
        trim: true
    }
};
