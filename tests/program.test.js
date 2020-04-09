const supertest = require('supertest');
const app = require('../app');
const db = require('../db');
const request = supertest(app);
const {
    createAuthor,
    createProgram
} = require('./commonRequests');

describe('Test programRouter', () => {
    // beforeEach is used to re-create the database between tests
    // This ensures tests are isolated from each other
    // Each test can enter its own data into the new database
    beforeEach(async () => {
        return db.connect(app);
    });

    it('Responds to POST with content-type JSON', async () => {
        return request.post('/program')
            .expect('Content-Type', /json/);
    })

    it('Responds to POST with 201-Created if everything is alright', async () => {
        const program = {
            author: 'test',
            description: 'description'
        }

        await createAuthor(program.author)
            .expect(201);

        await createProgram(program.author, program.description)
            .expect(201);
    });

    it('Responds to POST with error 422-Unprocessable Entity if request has empty body', async () => {
        await request.post('/program')
            .expect(422)
    });

    it('Responds to POST with error 424-Failed Dependency if the specified author does not exist', async () => {
        await createProgram('fake')
            .expect(424)
    });

    it('Responds to POST with error 422-Unprocessable Entity if a field in the request body is missing, empty or contains invalid data', async () => {
        const program = {
            author: 'test',
            description: 'description'
        };

        await createAuthor(program.author)
            .expect(201);

        await request.post('/program')
            .send({
                author:program.author
            })
            .expect(422);

        await request.post('/program')
            .send({
                author:'',
                description:program.description
            })
            .expect(422);

        await request.post('/program')
            .send({
                description:program.description
            })
            .expect(422);
    });

    it('Responds to GET with content-type JSON', async () => {
        return request.get('/program')
            .expect('Content-Type', /json/);
    });

    it('Responds to GET with 404-Not Found if given an Id that does not exist', async () => {
        return request.get('/program/fake_id')
            .expect(404);
    });

    it('Responds to GET with 422-Unprocessable Entity if given an Id that could not exist', async () => {
        return request.get('/program/%23%23')
            .expect(422);
    });

    it('Responds to GET with the correct data when given a valid, real Id', async () => {
        const program = {
            author: 'test',
            description: 'description'
        }

        await createAuthor(program.author)
            .expect(201);

        const post_res = await createProgram(program.author, program.description)
            .expect(201);

        const id = post_res.body.id;

        const res = await request.get('/program/' + id)
            .expect(200);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('date');
        expect(res.body.author).toBe(program.author);
        expect(res.body.description).toBe(program.description)
    });
});