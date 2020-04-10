const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

module.exports = {
    createAuthor: function (id='test@example.com', name='test') {
        return request.post('/author')
            .send({
                id: id,
                name: name
            })
            .expect('Content-Type', /json/);
    },

    createProgram: function (authorId='test@example.com', description='description') {
        return request.post('/program')
            .send({
                authorId: authorId,
                description: description
            })
            .expect('Content-Type', /json/);
    }
};
