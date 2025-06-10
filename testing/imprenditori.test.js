const express = require('express');
const request = require('supertest');
const imprenditoriRouter = require('../API/imprenditori.cjs');
const accountsRouter = require('../API/accounts.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/imprenditori', imprenditoriRouter);
app.use('/api/v1/accounts', accountsRouter);

const DUMMY_USER_ID = '000000000000000000000000';
const REAL_IMPRENDITORE_ID= '68433917a15a06ce864c343c';
const PRODUCT_ID = '6823963fe3f68207540baa2d'; 
const EMAIL_CLIENTE = 'miralem@pjanic.juve';
const EMAIL_IMPRENDITORE = 'leonardo@tmail.com';
const EMAIL_ERRATA = 'errata@marketrento.com';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});



describe('Imprenditori Carrello API - Authenticated/Valid requests', () => {
    const token = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/imprenditori/:id/carrello with valid user', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori/${REAL_IMPRENDITORE_ID}/carrello`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/imprenditori/:id/carrello/add with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${REAL_IMPRENDITORE_ID}/carrello/add`)
            .set('x-access-token', token)
            .send({ _id: PRODUCT_ID, nome: 'ProdottoTest', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/imprenditori/:id/carrello/removeOne with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${REAL_IMPRENDITORE_ID}/carrello/removeOne`)
            .set('x-access-token', token)
            .send({ nome: 'ProdottoTest' });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/imprenditori/:id/carrello/clear with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${REAL_IMPRENDITORE_ID}/carrello/clear`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
});

describe('Imprenditori Carrello API - Unauthenticated/Invalid requests', () => {

    test('GET /api/v1/imprenditori/:id/carrello with non-existent user', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori/${DUMMY_USER_ID}/carrello`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Carrello non trovato');
    });

    test('POST /api/v1/imprenditori/:id/carrello/add with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${DUMMY_USER_ID}/carrello/add`)
            .send({ _id: 'fake', nome: 'Prodotto', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/imprenditori/:id/carrello/removeOne with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${DUMMY_USER_ID}/carrello/removeOne`)
            .send({ nome: 'Prodotto' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/imprenditori/:id/carrello/clear with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/${DUMMY_USER_ID}/carrello/clear`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

});


describe('Query parameter con email, Clienti, Imprenditori e Venditori', ()=>{

    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/imprenditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori?email=${EMAIL_IMPRENDITORE}`)
            .set('x-access-token', tokenI);
        expect(response.statusCode).toBe(200);
    });

});

describe('Query parameter email errata, Imprenditori ', ()=>{

    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/imprenditori?email=email returns 2404', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenI);
        expect(response.statusCode).toBe(404);
    });

});


describe('Create and delete imprenditore', () => {
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const nuovaDescrizione = 'Nuova descrizione';
    const nuovaSede = 'Rovereto';
    let id;
    test('POST /api/v1/imprenditori/add with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/imprenditori/add`)
            .set('x-access-token', tokenC)
            .send(  { 
                nome: 'test',
                cognome: 'test',
                birthdate: new Date(),
                email: 'test@imprenditori.com',
                username: 'test_imp',
                password: 'test_imp',
                sede: 'Trento',
                descrizione: 'Imprenditore di test',
                tipo: 'Promotore',
                carrello: [],
            } );
        id=response.body._id;
        expect(response.statusCode).toBe(201);
    });

    test('GET /api/v1/imprenditori/:id with valid data', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori/${id}`)
            .set('x-access-token', tokenI)
        expect(response.statusCode).toBe(200);
    });
    test('DELETE /api/v1/imprenditori/:id with valid data', async () => {
        const response = await request(app)
            .delete(`/api/v1/imprenditori/${id}`)
            .set('x-access-token', tokenI)
        expect(response.statusCode).toBe(200);
    });

});