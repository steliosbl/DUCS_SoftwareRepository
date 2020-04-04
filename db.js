const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const Memory = require('lowdb/adapters/Memory')

const db = {
    connect: async function (app) {
        app.db = await lowdb(
            process.env.NODE_ENV === 'test'
                ? new Memory()
                : new FileAsync('.data/db.json')
        );
    }
}

module.exports = db;