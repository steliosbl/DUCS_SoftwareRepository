const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

module.exports = {
    createAuthor: function (id='test', email='test@example.com') {
        return request.post('/author')
            .send({
                id: id,
                email: email
            })
            .expect('Content-Type', /json/);
    },

    createProgram: function (author='test', description='description') {
        return request.post('/program')
            .send({
                author: author,
                description: description
            })
            .expect('Content-Type', /json/);
    }
};
