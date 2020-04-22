/**
 * Valid Author/User format
 * @typedef {Object} Author
 * @property {string} id The unique Id of the Author (should be their email)
 * @property {string} name The Author's name
 * @property {date} registrationDate The date the Author was registered
 * @property {date} loginDate The date of the Author's last login
 */
/**
 * Valid Program format
 * @typedef {Object} Program
 * @property {string} id The unique Id of the program
 * @property {string} name The name of the program
 * @property {string} description The description of the program
 * @property {Author} author The object representing the author if the program
 * @property {Date} creationDate The date the program was created on
 * @property {Date} modificationDate The date of the last time the program was modified
 */
