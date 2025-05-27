const express = require('express');
const router = express.Router();
const VendorModel= require('../models/vendorModel.cjs');
const ClientModel = require('../models/clientModel.cjs');
const EntrepreneurModel = require('../models/promoterModel.cjs');

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

module.exports = router;
//esporto api legate a recupero account