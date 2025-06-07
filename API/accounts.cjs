/**
 * @swagger
 * 
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         cognome:
 *           type: string
 *         birthdate:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         carrello:
 *           type: array
 *     Imprenditore:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         cognome:
 *           type: string
 *         birthdate:
 *           type: string
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         sede:
 *           type: string
 *         descrizone:
 *           type: string
 *         tipo:
 *          type: string
 *        carrello:
 *          type: array
 *    Venditore:
 *      type: object
 *      properties:
 *        nome:
 *          type: string
 *        cognome:
 *          type: string
 *        birthdate:
 *          type: string
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        password:
 *          type: string
 *        sede:
 *          type: string
 *        descrizone:
 *          type: string
 *        tipo:
 *          type: string
 *        datiPagamento:
 *          type: string
 *        carrello:
 *          type: array
 *    Admin:
 *      type: object
 *      properties:
 *        nome:
 *          type: string
 *        cognome:
 *          type: string
 *        birthdate:
 *          type: string
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        password:
 *          type: string
 *  
 * /accounts/cliente/{email}:
 *   get:
 *     summary: Retrieve a user account by email
 *     description: Retrieve a user account (Cliente, Imprenditore, Venditore, Admin) by email.
 *     responses:
 *      '200':
 *        description: Cliente trovato
 *        content:
 *         application/json:
 *        schema:
 *          $ref: '#/components/schemas/Cliente'
 * *     '404':
 *        description: Cliente non trovato
 *       '500':
 *        description: Errore del server
 * /accounts/imprenditore/{email}:
 *  get:
 *   summary: Retrieve an entrepreneur account by email
 *  description: Retrieve an entrepreneur account by email.
 * *  responses:
 *   '200':
 *     description: Imprenditore trovato
 * *   content:
 *     application/json:
 *      schema:
 *        $ref: '#/components/schemas/Imprenditore'
 * *   '404':
 *     description: Imprenditore non trovato
 * *   '500':
 *     description: Errore del server
 * /accounts/venditore/{email}:
 *  get:    
 *  summary: Retrieve a vendor account by email
 *  description: Retrieve a vendor account by email.
 *  responses:
 *   '200':
 *    description: Venditore trovato
 * *  content:
 *    application/json:
 *     schema:
 *      $ref: '#/components/schemas/Venditore'
 * * '404':
 *     description: Venditore non trovato
 * * '500':
 *     description: Errore del server
 * /accounts/admin/{email}:
 *  get:
 *    summary: Retrieve an admin account by email
 *    description: Retrieve an admin account by email.
 *    responses:
 *     '200':
 *       description: Admin trovato
 *       content:
 *       application/json:
 *       schema:
 *          $ref: '#/components/schemas/Admin'
 * *   '404':
 *         description: Admin non trovato
 * *   '500':
 *        description: Errore del server
 * /accounts/password:
 *   put:
 *     summary: Update user password
 *     description: Update the password of a user account (Cliente, Imprenditore, Venditore, Admin).
 *     requestBody:
 *     required: true
 *     content: oldPassword, newPassword
 *     responses:
 *     '200':
 *       description: Password aggiornata con successo
 * *     '400':
 *       description: Richiesta non valida
 *  *     '401':
 *      description: Vecchia password errata
 * *     '404':
 *       description: Utente non trovato
 * *     '500':
 *      description: Errore del server
 * /accounts/registrazione:
 *  post:
 *   summary: Register a new user account
 * *  description: Register a new user account (Cliente) with the provided details.
 *  requestBody:
 *  required: true
 * *  content:
 *  application/json:
 *  schema:
 *   type: object
 * *   properties:
 *    nome:
 *     type: string
 * *    cognome:
 *     type: string
 * *    birthdate:
 *    type: string
 * *    email:
 *     type: string
 * *    username:
 *     type: string
 * *    password:
 *     type: string
 * *  responses:
 *   '201':
 *    description: Registrazione avvenuta con successo
 * *   content:
 *    application/json:
 *   schema:
 *   type: object
 * *   properties:
 *   success:
 *    type: boolean
 * *   message:
 *   type: string
 * *   '400':
 *   description: Richiesta non valida, campi mancanti
 * content:
 *    application/json:
 *   schema:
 *   type: object
 * *   properties:
 *   success:
 *    type: boolean
 * *   error:
 *   type: string
 * *   '500':
 *  description: Errore del server
*/
const express = require('express');
const router = express.Router();
const VendorModel= require('../models/vendorModel.cjs');
const ClientModel = require('../models/clientModel.cjs');
const ClientService = require('../services/clienteService.cjs');
const EntrepreneurModel = require('../models/promoterModel.cjs');
const { hashPassword, comparePassword } = require('../passwordmanager.cjs');
const { tokenChecker } = require('../tokenchecker.cjs');
const DBClient = require('../models/clientModel.cjs');
const DBVendor = require('../models/vendorModel.cjs');
const DBEntrepreneur = require('../models/promoterModel.cjs');
const DBAdmin = require('../models/adminModel.cjs');
const Cliente  = require('../classes/Cliente.cjs');

router.get('/cliente/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const client = await ClientModel.findOne({ email: email });
        if (!client) {
            return res.status(404).json({ error: 'Cliente non trovato' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Errore durante il recupero dell account cliente:', error);
        res.status(500).json({ error: 'Errore del server' });
}});

router.get('/imprenditore/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const entrepreneur = await EntrepreneurModel.findOne({ email: email });
        if (!entrepreneur) {
            return res.status(404).json({ error: 'Imprenditore non trovato' });
        }
        res.status(200).json(entrepreneur);
    } catch (error) {
        console.error('Errore durante il recupero dell account imprenditore:', error);
        res.status(500).json({ error: 'Errore del server' });
}});

router.get('/venditore/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const vendor = await VendorModel.findOne({ email: email });
        if (!vendor) {
            return res.status(404).json({ error: 'Venditore non trovato' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error('Errore durante il recupero del venditore:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
router.get('/admin/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const admin = await DBAdmin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ error: 'Admin non trovato' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error('Errore durante il recupero admin:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
router.put('/password', tokenChecker('Cliente'), async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers['x-access-token'];
        const decoded = require('jsonwebtoken').verify(token, process.env.SUPER_SECRET);
        const ruolo = decoded.aut;
        const email = decoded.email;

        let userModel;
        if (ruolo === 'Cliente') userModel = DBClient;
        else if (ruolo === 'Venditore') userModel = DBVendor;
        else if (ruolo === 'Imprenditore') userModel = DBEntrepreneur;
        else return res.status(400).json({ error: 'Ruolo non valido' });

        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Vecchia password errata' });

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ success: true, message: 'Password aggiornata!' });
    } catch (err) {
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.post('/registrazione', async (req, res) => {
    try {
        const { nome, cognome, birthdate, email, username, password } = req.body;

        if (!nome || !cognome || !birthdate || !email || !username || !password) {
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
        }
        const hashedPassword = await hashPassword(password);
        const cliente=new Cliente(nome, cognome, birthdate, email, username, hashedPassword);
        const result = await ClientService.nuovaregistrazione(cliente);
    if (result.success) {
    res.status(201).json({ success: true, message: result.message });
    } else {
    res.status(400).json({ success: false, error: result.error });
    } 
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
    }
);
module.exports = router;
//esporto api legate a recupero account