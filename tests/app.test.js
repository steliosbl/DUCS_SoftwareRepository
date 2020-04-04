/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Test the root path', () => {
    test('Should respond to GET', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});