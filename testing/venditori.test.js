const express = require('express');
const request = require('supertest');
const venditoriRouter = require('../API/venditori.cjs');
const accountsRouter = require('../API/accounts.cjs');
const DBVendor = require('../models/vendorModel.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/venditori', venditoriRouter);
app.use('/api/v1/accounts', accountsRouter);

const DUMMY_USER_ID = '000000000000000000000000';
const REAL_VENDITORE_ID= '6824a50ac5b5b7b972aaa98c';
const PRODUCT_ID = '6823963fe3f68207540baa2d'; 
const EMAIL_VENDITORE = 'p@gm.com';
const EMAIL_ERRATA = 'errata@marketrento.com';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.DB_URL);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

describe('venditoriRouter module should be defined', () => {
    test('venditoriRouter should be defined', () => {
        expect(venditoriRouter).toBeDefined();
    });
});

describe('Venditori Carrello API - Unauthenticated/Invalid requests', () => {

    test('GET /api/v1/venditori/:id/carrello with non-existent user', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori/${DUMMY_USER_ID}/carrello`);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Carrello non trovato');
    });

    test('POST /api/v1/venditori/:id/carrello/add with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${DUMMY_USER_ID}/carrello/add`)
            .send({ _id: 'fake', nome: 'Prodotto', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/venditori/:id/carrello/removeOne with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${DUMMY_USER_ID}/carrello/removeOne`)
            .send({ nome: 'Prodotto' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

    test('POST /api/v1/venditori/:id/carrello/clear with non-existent user', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${DUMMY_USER_ID}/carrello/clear`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Utente non trovato' });
    });

});

describe('Venditori Carrello API - Authenticated/Valid requests', () => {
    const token = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/venditori/:id/carrello with valid user', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori/${REAL_VENDITORE_ID}/carrello`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/venditori/:id/carrello/add with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${REAL_VENDITORE_ID}/carrello/add`)
            .set('x-access-token', token)
            .send({ _id: PRODUCT_ID, nome: 'ProdottoTest', prezzo: 10, quantity: 1 });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/venditori/:id/carrello/removeOne with valid data', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${REAL_VENDITORE_ID}/carrello/removeOne`)
            .set('x-access-token', token)
            .send({ nome: 'ProdottoTest' });
        expect(response.statusCode).toBe(200);
    });

    test('POST /api/v1/venditori/:id/carrello/clear with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/${REAL_VENDITORE_ID}/carrello/clear`)
            .set('x-access-token', token);
        expect(response.statusCode).toBe(200);
    });
});

describe('Query parameter con email, Venditori', ()=>{

    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
   
    test('GET /api/v1/venditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori?email=${EMAIL_VENDITORE}`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(200);
    });

});

describe('Query parameter email errata, Venditori', ()=>{

    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET /api/v1/venditori?email=email returns 404', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(404);
    });

});

describe('Create and delete venditore', () => {
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const nuovaDescrizione = 'Nuova descrizione';
    const nuovaSede = 'Rovereto';
    let id;

    afterAll(async () => {
        // Pulisci il DB
        await DBVendor.deleteOne({ _id: id });
    });

    test('POST /api/v1/venditori/registrazione with valid user', async () => {
        const response = await request(app)
            .post(`/api/v1/venditori/registrazione`)
            .set('x-access-token', tokenV)
            .send(  { 
                nome: 'test2',
                cognome: 'test2',
                birthdate: new Date(),
                email: 'test@venditori.com',
                username: 'test_vend',
                password: 'test_vend',
                sede: 'Trento',
                descrizione: 'Imprenditore di test',
                tipo: 'venditore',
                carrello: [],
            } );
        id=response.body._id;
        expect(response.statusCode).toBe(201);
    });

    test('GET /api/v1/venditori/:id with valid data', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori/${id}`)
            .set('x-access-token', tokenV)
        expect(response.statusCode).toBe(200);
    });
    test('PUT /api/v1/venditori/:id/descrizione with valid data', async () => {
        const response = await request(app)
            .put(`/api/v1/venditori/${id}/descrizione`)
            .set('x-access-token', tokenV)
            .send(JSON.stringify({ descrizione: nuovaDescrizione }))
            .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200);
    });
    test('PUT /api/v1/venditori/:id/sede with valid data', async () => {
        const response = await request(app)
            .put(`/api/v1/venditori/${id}/sede`)
            .set('x-access-token', tokenV)
            .send(JSON.stringify({ sede: nuovaSede }))
            .set('Content-Type', 'application/json')
        expect(response.statusCode).toBe(200);
    });

});

describe('GET all venditori', () => {
    
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET all venditori /api/v1/venditori/all', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori/all`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(200);
    });

});