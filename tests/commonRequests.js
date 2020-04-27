const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const path = require('path');

const defaults = require('./data/defaults');
const image_dir = path.join(__dirname, 'data/images');

module.exports = {
    createAuthor: (id, name) => {
        return request.post('/author')
            .send({
                id: id || defaults.authorId,
                name: name || defaults.name
            })
            .expect('Content-Type', /json/);
    },

    createProgram: (sessionId, description, title) => {
        return request.post('/program')
            .send({
                description: description || defaults.description,
                sessionId: sessionId || defaults.authorId,
                title: title || defaults.title
            })
            .expect('Content-Type', /json/);
    },

    uploadImage: (filename, programId) => {
        return request.post('/image')
            .attach('image', path.join(image_dir, filename))
            .field('sessionId', defaults.authorId)
            .field('id', programId);
    }
};
