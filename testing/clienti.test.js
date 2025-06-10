const express = require('express');
const request = require('supertest');
const clientiRouter = require('../API/clienti.cjs');
const accountsRouter = require('../API/accounts.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/clienti', clientiRouter);
app.use('/api/v1/accounts', accountsRouter);

const DUMMY_USER_ID = '000000000000000000000000';
const REAL_USER_ID = '6836ce090b73daa5b5bf653b'; 
const PRODUCT_ID = '6823963fe3f68207540baa2d'; 
const EMAIL_CLIENTE = 'miralem@pjanic.juve';
const EMAIL_ERRATA = 'errata@marketrento.com';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('clientiRouter module should be defined', () => {
    test('clientiRouter should be defined', () => {
        expect(clientiRouter).toBeDefined();
    });
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
    const token = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/clienti/:id/carrello with valid user', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti/${REAL_USER_ID}/carrello`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/clienti/:id/carrello/add with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/add`)
            .set('x-access-token', token)
            .send({ _id: PRODUCT_ID, nome: 'ProdottoTest', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/clienti/:id/carrello/removeOne with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/removeOne`)
            .set('x-access-token', token)
            .send({ nome: 'ProdottoTest' });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/clienti/:id/carrello/clear with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/clienti/${REAL_USER_ID}/carrello/clear`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
});

describe('Query parameter con email, Clienti', ()=>{
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
   
    test('GET /api/v1/clienti?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti?email=${EMAIL_CLIENTE}`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(200);
    });

});

describe('Query parameter email errata, Clienti', ()=>{
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    
    test('GET /api/v1/clienti?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(404);
    });

});


describe('Create and delete cliente', () => {
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    let id;
    test('POST /api/v1/accounts/registrazione with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/accounts/registrazione`)
            .set('x-access-token', tokenC)
            .send(  { 
                nome: 'test1',
                cognome: 'test1',
                birthdate: new Date(),
                email: 'test@clienti.com',
                username: 'test_cliente',
                password: 'test_cliente',
            } );
        id=response.body._id;
        expect(response.statusCode).toBe(201);
    });

    test('GET /api/v1/clienti?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti?email=${'test@clienti.com'}`)
            .set('x-access-token', tokenC);
        id=response.body._id;
        expect(response.statusCode).toBe(200);
    });

    test('DELETE /api/v1/clienti/:id with valid data', async () => {
        const response = await request(app)
            .delete(`/api/v1/clienti/${id}`)
            .set('x-access-token', tokenC)
        expect(response.statusCode).toBe(200);
    });

});


