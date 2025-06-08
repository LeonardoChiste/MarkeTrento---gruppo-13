require('dotenv').config({ path: 'process.env' }); 

const express = require('express');
const request = require('supertest');
const carrelliRouter = require('../API/carrelli.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const Test = require('supertest/lib/test');

const app = express();
app.use(express.json()); 
app.use('/api/v1/carrelli', carrelliRouter);

const DUMMY_USER_ID = '000000000000000000000000'; 
const REAL_USER_ID = '6836ce090b73daa5b5bf653b'; 
const PRODUCT_ID = '6823963fe3f68207540baa2d';

beforeAll(async () => {
    jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('Carrelli API utente non autenticato', () => {

    test('GET /api/v1/carrelli/:userType/:userId with invalid userType', async () => {
        const response = await request(app)
            .get(`/api/v1/carrelli/invalidType/${DUMMY_USER_ID}`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Tipo utente non valido' });
    });

    test('GET /api/v1/carrelli/:userType/:userId with non-existent user', async () => {
        const response = await request(app)
            .get(`/api/v1/carrelli/cliente/${DUMMY_USER_ID}`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Carrello non trovato');
    });

    test('POST /api/v1/carrelli/:userType/:userId/add with invalid userType', async () => {
        const response = await request(app)
            .post(`/api/v1/carrelli/invalidType/${DUMMY_USER_ID}/add`)
            .send({ _id: 'fake', nome: 'Prodotto', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Tipo utente non valido' });
    });

    test('POST /api/v1/carrelli/:userType/:userId/add with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/carrelli/cliente/${DUMMY_USER_ID}/add`)
            .send({ _id: 'fake', nome: 'Prodotto', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/carrelli/:userType/:userId/removeOne with invalid userType', async () => {
        const response = await request(app)
            .post(`/api/v1/carrelli/invalidType/${DUMMY_USER_ID}/removeOne`)
            .send({ nome: 'Prodotto' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Tipo utente non valido' });
    });

    test('POST /api/v1/carrelli/:userType/:userId/clear with invalid userType', async () => {
        const response = await request(app)
            .post(`/api/v1/carrelli/invalidType/${DUMMY_USER_ID}/clear`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Tipo utente non valido' });
    });

    
});

describe('Carrelli API utente autenticato', () => {
    var token = jwt.sign({ userId: '${REAL_USER_ID}', userType: 'cliente' }, 
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/carrelli/:userType/:userId (should return 404 if user does not exist)', async () => {
        const response = await request(app)
            .get(`/api/v1/carrelli/cliente/${REAL_USER_ID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200); 
    });

    test('POST /api/v1/carrelli/:userType/:userId/clear (should return 404 if user does not exist)', async () => {
        const response = await request(app)
            .post(`/api/v1/carrelli/cliente/${REAL_USER_ID}/clear`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200); 
    });

});