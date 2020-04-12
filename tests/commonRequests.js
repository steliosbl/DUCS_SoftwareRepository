const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const defaults = require('./data/defaults');

module.exports = { 
    createAuthor: (id, name) => {
        return request.post('/author')
            .send({
                id: id || defaults.authorId,
                name: name || defaults.name
            })
            .expect('Content-Type', /json/);
    },

    createProgram:(sessionId, description) => {
        return request.post('/program')
            .send({
                description: description || defaults.description,
                sessionId: sessionId || defaults.authorId
            })
            .expect('Content-Type', /json/);
    }
};
