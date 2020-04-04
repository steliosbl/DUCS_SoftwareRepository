// Dependencies
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const Memory = require('lowdb/adapters/Memory');

// This object contains the 'connect()' function which initializes the database and passes it to the app
// The NODE_ENV variable is used to determine if this is a testing or production environment
// For testing environments an in-memory database is used
// For production a JSON file is used
const db = {
    // This function takes the app as parameter, and passes the database to it
    connect: async function (app) {
        app.db = await lowdb(
            process.env.NODE_ENV === 'test'
                ? new Memory()
                : new FileAsync('.data/db.json')
        );
    }
};

module.exports = db;
