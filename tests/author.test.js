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
        const bodies = [{
                email: 'test@example.com'
            },
            {
                id: 'test'
            },
            {
                id: '',
                email: 'test@example.com'
            },
            {
                id: 'test',
                email: ''
            },
            {
                id: '~!@#$%^&*()_+',
                email: 'test@example.com"'
            },
            {
                id: 'test',
                email: 'not_an_email'
            }
        ]

        return await bodies.map(async body => {
            await request.post('/author')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(422);
        })
    });

    it('Responds to POST with 201-Created and the right data if everything is correct', async () => {
        const id = 'test';
        const email = 'test@example.com'
        const res = await commonRequests.createAuthor(id, email)
            .expect(201);

        expect(res.body.id).toBe(id);
        expect(res.body.email).toBe(email);
        expect(res.body).toHaveProperty('registrationDate');
    });

    it('Responds to POST with 409-Conflict if the given ID is already in use', async () => {
        const id = 'usedId';

        await commonRequests.createAuthor(id, "foo@example.com")
            .expect(201);

        return await commonRequests.createAuthor(id, "bar@example.com")
            .expect(409);
    });

    it('Responds to POST with 409-Conflict if an author with the given email has already registered', async () => {
        const email = 'taken@example.com';
        await commonRequests.createAuthor('foo', email)
            .expect(201);

        return await commonRequests.createAuthor('bar', email)
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

    it('Responds to GET with 200-Ok and the correct data if given an Id that corresponds to a data item', async () => {
        id = 'test';
        await commonRequests.createAuthor(id)
            .expect(201);

        const get = await request.get('/author/' + id)
            .expect(200);

        expect(get.body.id).toBe(id);
        expect(get.body).toHaveProperty('email');
        expect(get.body).toHaveProperty('registrationDate');
    });
});