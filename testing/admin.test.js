const express = require('express');
const request = require('supertest');
const adminRouter = require('../API/admin.cjs');
const accountsRouter = require('../API/accounts.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/accounts', accountsRouter);

const EMAIL_ADMIN = 'admin@marketrento.com';
const EMAIL_ERRATA = 'errata@marketrento.com';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('Query parameter con email, Admin', ()=>{

    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/admin?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/admin?email=${EMAIL_ADMIN}`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(200);
    });
});

describe('Query parameter email errata, Admin', ()=>{

    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    
    test('GET /api/v1/admin?email=email returns 404', async () => {
        const response = await request(app)
            .get(`/api/v1/admin?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(404);
    });
});