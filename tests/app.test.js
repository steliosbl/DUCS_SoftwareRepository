/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('Test general express app behavior', () => {
    test('Should respond to GET', async () => {
        await request(app).get('/')
            .expect(200);
    });

    test('Should respond with error 404-Not Found if invalid path given', async () => {
        await request(app).get('/fake')
            .expect(404);
    });
});