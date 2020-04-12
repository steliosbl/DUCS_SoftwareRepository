const supertest = require('supertest');
const app = require('../app');
const db = require('../db');
const request = supertest(app);

const defaults = require('./data/defaults');
const { createAuthor, createProgram } = require('./commonRequests');

describe('Test programRouter', () => {
    // beforeEach is used to re-create the database between tests
    // This ensures tests are isolated from each other
    // Each test can enter its own data into the new database
    beforeEach(async () => {
        return db.connect(app);
    });

    it('Responds to POST with content-type JSON', async () => {
        await request.post('/program')
            .expect('Content-Type', /json/);
    })

    it('Responds to POST with 201-Created if everything is alright', async () => {
        await createAuthor()
            .expect(201);

        await createProgram()
            .expect(201);
    });

    it('Responds to POST with error 422-Unprocessable Entity if request has empty body', async () => {
        await request.post('/program')
            .expect(422)
    });

    it('Responds to POST with error 424-Failed Dependency if the specified author does not exist', async () => {
        await createProgram('fake@author.com')
            .expect(424)
    });

    it('Responds to POST with error 422-Unprocessable Entity if a field in the request body is missing, empty or contains invalid data', async () => {
        const program = {
            sessionId: defaults.authorId,
            description: defaults.description
        };

        await createAuthor(program.sessionId)
            .expect(201);

        await request.post('/program')
            .send({
                sessionId: program.sessionId
            }).expect(422);

        await request.post('/program')
            .send({
                sessionId: '',
                description: program.description
            }).expect(422);

        await request.post('/program')
            .send({
                description: program.description
            }).expect(422);
    });

    it('Responds to GET with content-type JSON', async () => {
        await request.get('/program')
            .expect('Content-Type', /json/);
    });

    it('Responds to GET with 404-Not Found if given an Id that does not exist', async () => {
        await request.get('/program?id=hKNNoMPFh')
            .expect(404);
    });

    it('Responds to GET with 422-Unprocessable Entity if given an Id that could not exist', async () => {
        await request.get('/program?id=%23%23')
            .expect(422);
    });

    it('Responds to GET with the correct data when given a valid, real Id', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.get('/program?id=' + id)
            .expect(200)
            .then(res => {
                expect(res.body).toHaveProperty('id');
                expect(res.body).toHaveProperty('creationDate');
                expect(res.body).toHaveProperty('modificationDate');
                expect(res.body.authorId).toBe(defaults.authorId);
                expect(res.body.description).toBe(defaults.description)
                expect(res.body.creationDate).toBe(res.body.modificationDate);
            })
    });

    it('Responds to PUT with content-type JSON', async () => {
        await request.put('/program?id=test')
            .expect('Content-Type', /json/);
    });

    it('Responds to PUT with 424-Failed Dependency if given a sessionId that does not exit', async () => {
        await createAuthor()
            .expect(201)

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.put('/program?id=' + id)
            .send({
                sessionId: 'fake@author.com'
            }).expect(424);
    });

    it('Responds to PUT with 403-Forbidden if given a sessionId that does not match the authorId of the program', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()).body.id

        const authorId = 'naughty@author.com';
        await createAuthor(authorId)
            .expect(201);

        await request.put('/program?id=' + id)
            .send({
                sessionId: authorId
            }).expect(403);
    })

    it('Responds to PUT with 404-Not Found if given an Id that does not exist', async () => {
        await createAuthor()
            .expect(201);

        return request.put('/program?id=hKNNoMPFh')
            .send({
                sessionId: defaults.authorId
            }).expect(404);
    });

    it('Responds to PUT with 422-Unprocessable Entity when given keys that do not exist', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()).body.id;

        return request.put('/program?id=' + id)
            .send({
                fake: 'key'
            }).expect(422)
    });

});