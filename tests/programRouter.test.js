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
        const sessionId = defaults.authorId;
        const description = defaults.description;
        const title = defaults.title;

        await createAuthor(sessionId)
            .expect(201);

        // Missing title
        await request.post('/program')
            .send({
                sessionId: sessionId,
                description: description
            }).expect(422);

        // Missing sessionId
        await request.post('/program')
            .send({
                description: description,
                title: title
            }).expect(422);

        // Missing description
        await request.post('/program')
            .send({
                sessionId: sessionId,
                title: title
            }).expect(422);
            
        // Empty title
        await request.post('/program')
            .send({
                sessionId: sessionId,
                description: description,
                title: ''
            }).expect(422);

        // Empty sessionId
        await request.post('/program')
            .send({
                sessionId: '',
                description: description,
                title: title
            }).expect(422);

        // Invalid sessionId
        await request.post('/program')
            .send({
                sessionId: 'invalid',
                description: description,
                title: title
            }).expect(422);
    });

    it('Responds to GET with content-type JSON', async () => {
        await request.get('/program')
            .expect('Content-Type', /json/);
    });

    it('Responds to GET with error 404-Not Found if given an Id that does not exist', async () => {
        await request.get('/program?id=' + defaults.programId)
            .expect(404);
    });

    it('Responds to GET with error 422-Unprocessable Entity if given an Id that could not exist', async () => {
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
                expect(res.body.length).toBe(1);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('creationDate');
                expect(res.body[0]).toHaveProperty('modificationDate');
                expect(res.body[0].authorId).toBe(defaults.authorId);
                expect(res.body[0].title).toBe(defaults.title);
                expect(res.body[0].description).toBe(defaults.description)
                expect(res.body[0].creationDate).toBe(res.body[0].modificationDate);
            })
    });

    it('Responds to GET with a JSON array when performing a search', async () => {
        await request.get('/program?q=test')
            .expect(200)
            .then(res => {
                expect(res.body.length).toBe(0);
                expect(Array.isArray(res.body)).toBe(true);
            });
    });

    it('Responds to GET with the correct data when searching with an exact Id', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()
            .expect(201)).body.id;

        await createProgram()
            .expect(201);

        await request.get('/program?q=' + id)
            .expect(200)
            .then(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].id).toBe(id);
                expect(res.body[0].title).toBe(defaults.title);
            })
    });

    it('Responds to GET with the correct data when searching with an exact author Id', async () => {
        await createAuthor()
            .expect(201);

        await createAuthor('different@author.com')
            .expect(201);

        await createProgram()
            .expect(201);

        await createProgram('different@author.com')
            .expect(201);

        await request.get('/program?q=' + defaults.authorId)
            .expect(200)
            .then(res => {
                expect(res.body.length).toBe(1);
                expect(res.body[0].authorId).toBe(defaults.authorId);
                expect(res.body[0].title).toBe(defaults.title);
            });
    });

    it('Responds to GET with the correct data when searching by title', async () => {
        await createAuthor()
            .expect(201);

        await createProgram(defaults.authorId, defaults.description, 'should_find')
            .expect(201);

        await createProgram(defaults.authorId, defaults.description, 'should_also_find')
            .expect(201);

        await createProgram(defaults.authorId, defaults.description, 'dont_find')
            .expect(201);

        await request.get('/program?q=should')
            .expect(200)
            .then(res => {
                expect(res.body.length).toBe(2)
                expect(res.body[0].authorId).toBe(defaults.authorId);
                expect(res.body[1].authorId).toBe(defaults.authorId);
            })
    });

    it('Responds to PUT with content-type JSON', async () => {
        await request.put('/program?id=test')
            .expect('Content-Type', /json/);
    });

    it('Responds to PUT with error 424-Failed Dependency if given a sessionId that does not exit', async () => {
        await createAuthor()
            .expect(201)

        const id = (await createProgram()
            .expect(201)).body.id;

        await request.put('/program?id=' + id)
            .send({
                sessionId: 'fake@author.com'
            }).expect(424);
    });

    it('Responds to PUT with error 403-Forbidden if given a sessionId that does not match the authorId of the program', async () => {
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

    it('Responds to PUT with error 404-Not Found if given an Id that does not exist', async () => {
        await createAuthor()
            .expect(201);

        return request.put('/program?id=' + defaults.programId)
            .send({
                sessionId: defaults.authorId
            }).expect(404);
    });

    it('Responds to PUT with error 422-Unprocessable Entity when given keys that do not exist', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()).body.id;

        return request.put('/program?id=' + id)
            .send({
                fake: 'key'
            }).expect(422)
    });

    it('Responds to PUT with error 424-Failed Dependency when given an authorId that does not exist', async () => {
        await createAuthor()
            .expect(201);

        const id = (await createProgram()).body.id;

        return request.put('/program?id=' + id)
            .send({
                sessionId: defaults.authorId,
                authorId: 'fake@id.com'
            }).expect(424)
    });

    it('Responds to PUT with the correct data if everything is ok', async () => {
        const data = {
            sessionId: defaults.authorId,
            authorId: 'other@id.com',
            title: 'Other title',
            description: 'A description'
        }
        
        await createAuthor()
            .expect(201);

        await createAuthor(data.authorId)
            .expect(201);

        const program = (await createProgram()).body;
        const id = program.id;
        const modificationDate = program.modificationDate

        return request.put('/program?id=' + id)
            .send(data)
            .expect(200)
            .then(res => {
                expect(res.body.id).toBe(id);
                expect(res.body.title).toBe(data.title);
                expect(res.body.authorId).toBe(data.authorId);
                expect(res.body.modificationDate === modificationDate).toBe(false)
            })
    });
});