const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

module.exports = {
    createAuthor: function (id='test', email='test@example.com') {
        return request.post('/author')
        .set('Accept', 'application/json')
        .send({
            id: id,
            email: email
        })
        .expect('Content-Type', /json/);
    }
};
