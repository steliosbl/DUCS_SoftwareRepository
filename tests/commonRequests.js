const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const defaultValues = {
    authorId: 'test@example.com',
    name: 'Test',
    description: 'Description'
}

module.exports = {
    createAuthor: function (id, name) {
        return request.post('/author')
            .send({
                id: id || defaultValues.authorId,
                name: name || defaultValues.name
            })
            .expect('Content-Type', /json/);
    },

    createProgram: function (sessionId, description, ) {
        return request.post('/program')
            .send({
                description: description || defaultValues.description,
                sessionId: sessionId || defaultValues.authorId
            })
            .expect('Content-Type', /json/);
    }
};
