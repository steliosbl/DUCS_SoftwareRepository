/**
 * Valid Author/User format
 * @typedef {Object} Author
 * @property {string} id The unique Id of the Author (should be their email)
 * @property {string} name The Author's name
 * @property {date} registrationDate The date the Author was registered
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

const listData = [{
    id: '4VIduloKlR9_7lPETevPV',
    name: 'program_1',
    description: 'test program',
    author: {
        id: 'real@test.com',
        name: 'Test Testerson'
    },
    creationDate: new Date(Date.now()),
    modificationDate: new Date(Date.now())
},
{
    id: 'va9reMQt4nb5JuKOzofjx',
    name: 'program_2',
    description: 'test program',
    author: {
        id: 'real@test.com',
        name: 'Test Testerson'
    },
    creationDate: new Date(Date.now()),
    modificationDate: new Date(Date.now())
}
];

export default class Api {
    constructor (address) {
        if (address) {
            this.Address = address;
        } else {
            this.Address = 'http://127.0.0.1:8000';
        }
    }

    withErrorHandler (handler) {
        this.errorHandler = handler;
        return this;
    }

    async searchPrograms (searchTerms) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return listData;
    }

    async getAuthor (id) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return id === 'real@test.com' ? {
            id: 'real@test.com',
            name: 'testy testerson',
            registrationDate: 'a date',
            loginDate: 'today'
        } : false;
    }

    async editAuthor (sessionId, data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: sessionId,
            name: data.name,
            registrationDate: 'another date',
            loginDate: 'today'
        };
    }

    async register (id, name) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    async editProgram (sessionId, program) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    async createProgram (sessionId, program) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: 'va9reMQt4nb5JuKOzofjx',
            name: program.name,
            description: program.description,
            authorId: sessionId,
            author: {
                id: sessionId,
                name: 'Test Testerson'
            }
        };
    }

    async deleteProgram (sessionId, program) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
};
