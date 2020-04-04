/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Test the root path', () => {
    // beforeEach is used to re-create the database between tests
    // This ensures tests are isolated from each other
    // Each test can enter its own data into the new database
    beforeEach(async () => {
        return db.connect(app);
    });

    test('Should respond to GET', async () => {
        const response = await request(app).get('/program');
        expect(response.statusCode).toBe(200);
        expect(response.body);
    });
});