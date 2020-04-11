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
        matches: /^[a-z ]+$/i, // Only characters allowed are a-z (case insensitive) and spaces
        notEmpty: true,
        escape: true,
        trim: true
    }
};
