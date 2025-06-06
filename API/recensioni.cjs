const express = require('express');
const router = express.Router();
const Recensione = require('../models/recensioneModel.cjs');
const Order = require('../models/orderModel.cjs');

// Crea una recensione
router.post('/', async (req, res) => {
    try {
        const { titolo, testo, stelle, ordine } = req.body;
        if (!titolo || !testo || !stelle || !ordine) {
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
        }
        // Verifica che l'ordine esista
        const order = await Order.findById(ordine);
        if (!order) return res.status(404).json({ error: 'Ordine non trovato.' });

        // Verifica che non esista già una recensione per questo ordine
        const existing = await Recensione.findOne({ ordine });
        if (existing) return res.status(400).json({ error: 'Hai già lasciato una recensione per questo ordine.' });

        // Salva la recensione
        const recensione = new Recensione({
            titolo,
            testo,
            stelle,
            ordine
        });
        await recensione.save();
        res.status(201).json({ message: 'Recensione salvata con successo!' });
    } catch (err) {
        console.error('Errore salvataggio recensione:', err);
        res.status(500).json({ error: 'Errore durante il salvataggio della recensione.' });
    }
});

// Ottieni tutte le recensioni per un venditore
router.get('/venditore/:venditoreId', async (req, res) => {
    try {
        const venditoreId = req.params.venditoreId;
        // Trova tutti gli ordini di questo venditore
        const orders = await Order.find({ venditore: venditoreId }).select('_id');
        const orderIds = orders.map(o => o._id);
        // Trova tutte le recensioni per questi ordini
        const recensioni = await Recensione.find({ ordine: { $in: orderIds } });
        res.json(recensioni);
    } catch (err) {
        console.error('Errore caricamento recensioni:', err);
        res.status(500).json({ error: 'Errore durante il caricamento delle recensioni.' });
    }
});

module.exports = router;