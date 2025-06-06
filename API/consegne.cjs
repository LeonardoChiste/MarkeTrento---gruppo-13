const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const Order = require('../models/orderModel.cjs');
const Consegna = require('../models/consegnaModel.cjs');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const multer = require('multer');
const upload = multer();

router.get('/', tokenChecker('Admin'), async (req, res) => {
    try {
        const consegne = await Consegna.find()
            .sort({ pubblicazione: -1 });
        res.json(consegne);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero delle consegne' });
    }
});

router.get('/inConsegna', tokenChecker('Admin'), async (req, res) => {
    try {
        const consegne = await Consegna.find( { 
            status: 'In consegna' 
            //data: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
        })
        .sort({ data: -1 })
        .limit(1);
        res.json(consegne[0] || null); // Return the first delivery or null if none found
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero delle consegne' });
    }
});

router.get('/:id', tokenChecker('Admin'), async (req, res) => {
    try {
        const consegna = await Consegna.findById(req.params.id);
        res.json(consegna);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero delle consegne' });
    }
});

router.post('/', tokenChecker('Admin'), upload.none(), async (req, res) => {
    try {
        const dati = req.body;
        const consegna = new Consegna({
            ordini: [],
            data: dati.date || new Date(),
            status: 'In consegna',
        });
        if (!consegna) {
            return res.status(400).json({ error: 'Dati di consegna mancanti' });
        }
        await consegna.save();
        console.log('Consegna creata con successo:', Consegna);
        res.status(201).json( { message: 'Consegna creata con successo', consegna: Consegna });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la creazione della consegna' });
    }
});

router.put('/:id', tokenChecker('Admin'), async (req, res) => {
    try {
        const { id } = req.body; // get the order id from the body
        const consegna = await Consegna.findById(req.params.id);
        if (!consegna) {
            return res.status(404).json({ error: 'Consegna non trovata' });
        }
        if (!id) {
            return res.status(400).json({ error: 'ID ordine mancante' });
        }
        consegna.ordini.push({ id }); // push as object { id: ... }
        await consegna.save();
        res.status(200).json({ message: 'Ordine aggiunto alla consegna', consegna });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'aggiornamento della consegna' });
    }
});

router.put('/:id/svuota', tokenChecker('Admin'), async (req, res) => {
    try {
        const Ordine = req.body;
        const Consegna = await Consegna.findById(req.params.id);
        if (!Consegna) {
            return res.status(404).json({ error: 'Consegna non trovata' });
        }
        if (!Ordine) {
            return res.status(400).json({ error: 'Dati di consegna mancanti' });
        }
        Consegna.ordine = [];
        Consegna.data = new Date(req.body.data) || new Date();
        await Consegna.save();
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'aggiornamento della consegna' });
    }
});

router.put('/approva', tokenChecker('Admin'), async (req, res) => {
    try {
        const consegna = await Consegna.findById(req.params.id);
        if (!consegna) {
            return res.status(404).json({ error: 'Consegna non trovata' });
        }
        consegna.status = 'Completata';
        await consegna.save();
        res.status(200).json({ message: 'Consegna approvata con successo', consegna });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante l\'approvazione della consegna' });
    }
});

module.exports = router;