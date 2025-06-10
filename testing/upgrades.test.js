const express = require('express');
const request = require('supertest');
const upgradesRouter = require('../API/upgrades.cjs');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/upgrades', upgradesRouter);


const EMAIL_ADMIN = 'admin@marketrento.com';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('GET all upgrades', () => {
    
    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET all upgrade requests /api/v1/upgrades', async () => {
        const response = await request(app)
            .get(`/api/v1/upgrades`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(200);
    });
});
