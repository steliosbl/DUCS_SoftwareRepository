const supertest = require('supertest');
const app = require('../app');
const db = require('../db');
const request = supertest(app);
const commonRequests = require('./commonRequests');

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
                id: 'test@example.com'
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: 'test'
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: '',
                id: 'test@example.com'
            })
            .expect(422);

        await request.post('/author')
            .send({
                id: '',
                name: 'test'
            })
            .expect(422);

        await request.post('/author')
            .send({
                name: '~!@#$%^&*()_+',
                id: 'test@example.com"'
            })
            .expect(422);
        await request.post('/author')
            .send({
                id: 'not_an_id',
                name: 'test'
            })
            .expect(422);
    });

    it('Responds to POST with 201-Created and the right data if everything is correct', async () => {
        const name = 'test';
        const id = 'test@example.com'
        const res = await commonRequests.createAuthor(id, name)
            .expect(201);

        expect(res.body.name).toBe(name);
        expect(res.body.id).toBe(id);
        expect(res.body).toHaveProperty('registrationDate');
    });

    it('Responds to POST with 409-Conflict if the given Id is already in use', async () => {
        const id = 'used@id.com';

        await commonRequests.createAuthor(id, 'foo')
            .expect(201);

        return await commonRequests.createAuthor(id, "bar")
            .expect(409);
    });

    it('Responds to GET with 404-Not Found if not given an Id', async () => {
        return await request.get('/author')
            .expect(404);
    });

    it('Responds to GET with 404-Not Found if given an Id that doesnt exist', async () => {
        return await request.get('/author/fake_id')
            .expect(404);
    });

    it('Responds to GET with 201-Created and the correct data if given an name that corresponds to a data item', async () => {
        const name = 'test';
        const id = 'test@example.com'
        await commonRequests.createAuthor(id,name)
            .expect(201);

        const res = await request.get('/author/' + id)
            .expect(200);

        expect(res.body.name).toBe(name);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('registrationDate');
    });
});