require('dotenv').config({ path: 'process.env' });

const express = require('express');
const request = require('supertest');
const clientiRouter = require('../API/clienti.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use('/api/v1/clienti', clientiRouter);

const DUMMY_USER_ID = '000000000000000000000000';
const REAL_USER_ID = '6836ce090b73daa5b5bf653b'; 
const PRODUCT_ID = '6823963fe3f68207540baa2d'; 

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('Clienti Carrello API - Unauthenticated/Invalid requests', () => {

    test('GET /api/v1/clienti/:id/carrello with non-existent user', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti/${DUMMY_USER_ID}/carrello`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Carrello non trovato');
    });

    test('POST /api/v1/clienti/:id/carrello/add with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${DUMMY_USER_ID}/carrello/add`)
            .send({ _id: 'fake', nome: 'Prodotto', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/clienti/:id/carrello/removeOne with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${DUMMY_USER_ID}/carrello/removeOne`)
            .send({ nome: 'Prodotto' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/clienti/:id/carrello/clear with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${DUMMY_USER_ID}/carrello/clear`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

});

describe('Clienti Carrello API - Authenticated/Valid requests', () => {
    const token = jwt.sign({ userId: REAL_USER_ID, userType: 'cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/clienti/:id/carrello (should return 200 or 404)', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti/${REAL_USER_ID}/carrello`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 404]).toContain(response.statusCode);
    });

    test('POST /api/v1/clienti/:id/carrello/add with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/add`)
            .set('Authorization', `Bearer ${token}`)
            .send({ _id: PRODUCT_ID, nome: 'ProdottoTest', prezzo: 10, quantity: 1 });
        expect([200, 404, 400]).toContain(response.statusCode);
    });

    test('POST /api/v1/clienti/:id/carrello/removeOne with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/removeOne`)
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'ProdottoTest' });
        expect([200, 404]).toContain(response.statusCode);
    });

    test('POST /api/v1/clienti/:id/carrello/clear with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/clear`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 404]).toContain(response.statusCode);
    });
});