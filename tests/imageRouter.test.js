const supertest = require('supertest');
const app = require('../app');
const db = require('../db');
const request = supertest(app);
const path = require('path');

const defaults = require('./data/defaults');
const {
    createAuthor,
    createProgram,
    uploadImage
} = require('./commonRequests');

const image_dir = path.join(__dirname, 'data/images');

describe('Test imageRouter', () => {
    // beforeEach is used to re-create the database between tests
    // This ensures tests are isolated from each other
    // Each test can enter its own data into the new database
    beforeEach(async () => {
        return db.connect(app);
    });

    it('Responds to POST with 200-Ok if everything is alright', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', defaults.authorId)
            .field('id', id)
            .expect(200);
    });

    it('Responds to POST with error 422-Unprocessable Entity if a field in the body is missing or invalid', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', defaults.authorId)
            .expect(422);

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', defaults.authorId)
            .expect(422);

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', 'not_an_id')
            .field('id', id)
            .expect(422);

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', defaults.authorId)
            .field('id', 'n')
            .expect(422);
    });

    it('Responds to POST with error 422-Unprocessable Entity if no file is uploaded', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .field('sessionId', defaults.authorId)
            .field('id', id)
            .expect(422);
    });

    it('Responds to POST with error 403-Forbidden if sessionId is incorrect', async () => {
        await createAuthor()
            .expect(201);

        await createAuthor('naughty@author.com')
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', 'naughty@author.com')
            .field('id', id)
            .expect(403);
    });

    it('Responds to POST with error 424-Failed Dependency if sessionId doesnt correspond to any registered user', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'valid.png'))
            .field('sessionId', 'fake@author.com')
            .field('id', id)
            .expect(424);
    });

    it('Responds to POST with error 422-Unprocessable Entity if given file is of the wrong type', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'wrong_type.gif'))
            .field('sessionId', defaults.authorId)
            .field('id', id)
            .expect(422);
    });

    it('Responds to POST with error 413-Payload Too Large if given file is too large (more than 1MB)', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.post('/image')
            .attach('image', path.join(image_dir, 'too_large.png'))
            .field('sessionId', defaults.authorId)
            .field('id', id)
            .expect(413);
    });

    it('Responds to GET with error 404-Not Found if not given an Id', async () => {
        await request.get('/image/')
            .expect(404);
    })

    it('Responds to GET with error 404-Not Found if given a fake Id', async () => {
        await request.get('/image/fake')
            .expect(404);
    })

    it('Responds to GET with 200-Ok if given an Id that corresponds to an existing image', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await uploadImage('valid.png', id)
            .expect(200);

        await request.get('/image/' + id)
            .expect(200);
    })
});