const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
const length = 21;

// This function is used to generate random Id strings for programs
// The random generation is not cryptographically secure but its fine
// The preset alphabet is A-Z (case insensitive), 0-9, underscore and hyphen
// The preset length is 21 characters
module.exports = () => {
    return [...Array(length)].reduce(a => a + alphabet[~~(Math.random() * alphabet.length)], '');
};
