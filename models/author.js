module.exports = {
    id: {
        in: ['body'],
        isEmail: true,
        escape: true,
        trim: true,
        normalizeEmail: true
    },

    name: {
        in: ['body'],
        matches: /^[a-z ]+$/i, // Only characters allowed are a-z (case insensitive) and spaces
        escape: true,
        trim: true
    }
};
