const supertest = require('supertest');
const app = require('../app');
const db = require('../db');
const request = supertest(app);

const defaults = require('./data/defaults');
const { createAuthor } = require('./commonRequests');

describe('Test authorRouter', () => {
    // beforeEach is used to re-create the database between tests
    // This ensures tests are isolated from each other
    // Each test can enter its own data into the new database
    beforeEach(async () => {
        return db.connect(app);
    });

    it('Responds to POST with content-type JSON', async () => {
        return await request.post('/author')
            .expect('Content-Type', /json/);
    });

    it('Responds to POST with error 422-Unprocessable Entity if request has empty body', async () => {
        return await request.post('/author')
            .expect(422)
    });

    it('Responds to POST with error 422-Unprocessable Entity if a field in the request body is missing, empty or contains invalid data', async () => {
        await request.post('/author')
            .send({
                id: defaults.authorId
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: defaults.name
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: '',
                id: defaults.authorId
            })
            .expect(422);

        await request.post('/author')
            .send({
                id: '',
                name: defaults.name
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: '~!@#$%^&*()_+',
                id: defaults.authorId
            })
            .expect(422);

        await request.post('/author')
            .send({
                id: 'not_an_id',
                name: defaults.name
            })
            .expect(422);
    });

    it('Responds to POST with 201-Created and the right data if everything is correct', async () => {
        await createAuthor()
            .expect(201)
            .then(res => {
                expect(res.body.name).toBe(defaults.name);
                expect(res.body.id).toBe(defaults.authorId);
                expect(res.body).toHaveProperty('registrationDate');
            });
    });

    it('Responds to POST with error 409-Conflict if the given Id is already in use', async () => {
        await createAuthor(defaults.authorId, 'foo')
            .expect(201);

        return await createAuthor(defaults.authorId, "bar")
            .expect(409);
    });

    it('Responds to GET with error 404-Not Found if not given an Id', async () => {
        return await request.get('/author')
            .expect(404);
    });

    it('Responds to GET with error 404-Not Found if given an Id that doesnt exist', async () => {
        return await request.get('/author/fake_id@example.com')
            .expect(404);
    });

    it('Responds to GET with 201-Created and the correct data if given an name that corresponds to a data item', async () => {
        await createAuthor()
            .expect(201);

        await request.get('/author/' + defaults.authorId)
            .expect(200)
            .then(res => {
                expect(res.body.id).toBe(defaults.authorId);
                expect(res.body.name).toBe(defaults.name);
                expect(res.body).toHaveProperty('registrationDate');
            });
    });
});