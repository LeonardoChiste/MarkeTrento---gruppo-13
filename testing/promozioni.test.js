const express = require('express');
const request = require('supertest');
const promoRouter = require('../API/promozioni.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/promozioni', promoRouter);


const EMAIL_CLIENTE = 'miralem@pjanic.juve';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('GET all  promozioni ', () => {
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET all promotions /api/v1/promozioni', async () => {
        const response = await request(app)
            .get(`/api/v1/promozioni`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(200);
    });
    
});
