const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const Order = require('../models/orderModel.cjs');
const Consegna = require('../models/consegnaModel.cjs');

router.get('/', async (req, res) => {
    try {
        const consegne = await Consegna.find()
            .sort({ pubblicazione: -1 });
        res.json(consegne);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero delle consegne' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const consegna = await Consegna.findById(req.params.id);
        res.json(consegna);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero delle consegne' });
    }
});

router.post('/', async (req, res) => {
    try {
        const Consegna = new Consegna();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la creazione della consegna' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const Ordine = req.body;
        const Consegna = await Consegna.findById(req.params.id);
        if (!Consegna) {
            return res.status(404).json({ error: 'Consegna non trovata' });
        }
        if (!Ordine) {
            return res.status(400).json({ error: 'Dati di consegna mancanti' });
        }
        Consegna.ordine.push(Ordine._id);
        await Consegna.save();
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'aggiornamento della consegna' });
    }
});

module.exports = router;