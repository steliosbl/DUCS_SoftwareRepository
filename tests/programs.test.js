const request = require('supertest');
const app = require('../app');
const db = require('../db');


describe('Test the root path', () => {
    beforeEach(async () => {
        return db.connect(app);
    });

    test('Should respond to GET', async () => {
        const response = await request(app).get('/programs');
        expect(response.statusCode).toBe(200);
        expect(response.body)
    });
});