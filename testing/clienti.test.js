const express = require('express');
const request = require('supertest');
const clientiRouter = require('../API/clienti.cjs');
const imprenditoriRouter = require('../API/imprenditori.cjs');
const venditoriRouter = require('../API/venditori.cjs');
const adminRouter = require('../API/admin.cjs');
const ordersRouter = require('../API/orders.cjs');
const upgradesRouter = require('../API/upgrades.cjs');
const promoRouter = require('../API/promozioni.cjs');
const accountsRouter = require('../API/accounts.cjs');
const DBVendor = require('../models/vendorModel.cjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });

const app = express();
app.use(express.json());
app.use('/api/v1/clienti', clientiRouter);
app.use('/api/v1/imprenditori', imprenditoriRouter);
app.use('/api/v1/venditori', venditoriRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/promozioni', promoRouter);
app.use('/api/v1/upgrades', upgradesRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/accounts', accountsRouter);

const DUMMY_USER_ID = '000000000000000000000000';
const REAL_USER_ID = '6836ce090b73daa5b5bf653b'; 
const REAL_IMPRENDITORE_ID= '68433917a15a06ce864c343c';
const REAL_VENDITORE_ID= '6824a50ac5b5b7b972aaa98c';
const REAL_ADMIN_ID= '6841d22b9bcd819028e08a6e';
const PRODUCT_ID = '6823963fe3f68207540baa2d'; 
const EMAIL_CLIENTE = 'miralem@pjanic.juve';
const EMAIL_IMPRENDITORE = 'leonardo@tmail.com';
const EMAIL_VENDITORE = 'p@gm.com';
const EMAIL_ADMIN = 'admin@marketrento.com';
const EMAIL_ERRATA = 'errata@marketrento.com'
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

describe('Query parameter con email, Clienti, Imprenditori e Venditori', ()=>{
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    
    test('GET /api/v1/clienti?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti?email=${EMAIL_CLIENTE}`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(200);
    });

    test('GET /api/v1/imprenditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori?email=${EMAIL_IMPRENDITORE}`)
            .set('x-access-token', tokenI);
        expect(response.statusCode).toBe(200);
    });

    test('GET /api/v1/venditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori?email=${EMAIL_VENDITORE}`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(200);
    });

    test('GET /api/v1/admin?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/admin?email=${EMAIL_ADMIN}`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(200);
    });
});

describe('Query parameter email errata, Clienti, Imprenditori e Venditori', ()=>{
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    
    test('GET /api/v1/clienti?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/clienti?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(404);
    });

    test('GET /api/v1/imprenditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/imprenditori?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenI);
        expect(response.statusCode).toBe(404);
    });

    test('GET /api/v1/venditori?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(404);
    });

    test('GET /api/v1/admin?email=email returns 200', async () => {
        const response = await request(app)
            .get(`/api/v1/admin?email=${EMAIL_ERRATA}`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(404);
    });
});

describe('GET all venditori, promozioni e upgrades', () => {
    const tokenC = jwt.sign({ email: EMAIL_CLIENTE, aut: 'Cliente' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenA = jwt.sign({ email: EMAIL_ADMIN, aut: 'Admin' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });

    test('GET all venditori /api/v1/venditori/all', async () => {
        const response = await request(app)
            .get(`/api/v1/venditori/all`)
            .set('x-access-token', tokenV);
        expect(response.statusCode).toBe(200);
    });
    /*test('GET all orders /api/v1/orders', async () => {
        const response = await request(app)
            .get(`/api/v1/orders`)
            .set('Authorization', `Bearer ${tokenA}`);
        expect(response.statusCode).toBe(200);
    });*/
    test('GET all promotions /api/v1/promozioni', async () => {
        const response = await request(app)
            .get(`/api/v1/promozioni`)
            .set('x-access-token', tokenC);
        expect(response.statusCode).toBe(200);
    });
    test('GET all upgrade requests /api/v1/upgrades', async () => {
        const response = await request(app)
            .get(`/api/v1/upgrades`)
            .set('x-access-token', tokenA);
        expect(response.statusCode).toBe(200);
    });
});

describe('Create and delete imprenditore', () => {
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

describe('Create and delete venditore', () => {
    const tokenV = jwt.sign({ email: EMAIL_VENDITORE, aut: 'Venditore' },
        process.env.SUPER_SECRET, { expiresIn: '86400' });
    const tokenI = jwt.sign({ email: EMAIL_IMPRENDITORE, aut: 'Imprenditore' },
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