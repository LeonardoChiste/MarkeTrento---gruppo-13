const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('./services/VenditoreService.cjs');
const router = express.Router();

//api venditore
router.get('', async (req, res) => {
    try {
        const venditori = await VenditoreServizio.getAllVenditori();
        res.status(200).json(venditori);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei venditori' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const venditore = await VenditoreServizio.getVendorById(req.params.id);
        if (!venditore) {
            return res.status(404).send('Venditore non trovato');
        }
        res.status(200).json(venditore);
    } catch (error) {
        res.status(500).send('Errore del server');
    }
});
module.exports = router;