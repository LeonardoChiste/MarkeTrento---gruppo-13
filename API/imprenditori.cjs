const express = require('express');
require('dotenv').config({ path: 'process.env' });
const ImprenditoreServizio = require('../services/businessService.cjs');
const DBEntrepreneur = require('../models/promoterModel.cjs');
const { tokenChecker } = require('../tokenchecker.cjs');
const router = express.Router();

//AGGIUNTA DI API IN FONDO AL MAIN, DA ORGANIZZARE, UNA SU IMPRENDITORE, UNA SU CLIENTE
router.put('/descrizione/:id', tokenChecker('Imprenditore'), async (req, res) => {
    try {
        const { descrizione } = req.body;
        const id = req.params.id;
        const imprenditoreAggiornato = await ImprenditoreServizio.updateDescrizione(descrizione, id);
        res.status(200).json(imprenditoreAggiornato);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della descrizione:', error.message);F
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.put('/sede/:id', tokenChecker('Imprenditore'), async (req, res) => {
    try {
        const { sede } = req.body;
        const id = req.params.id;
        const imprenditoreAggiornato = await ImprenditoreServizio.updateSede(sede, id);
        res.status(200).json(imprenditoreAggiornato);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'indirizzo:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const imprenditore = await DBEntrepreneur.findById(req.params.id);
        if (!imprenditore) {
            return res.status(404).send('Imprenditore non trovato');
        }
        res.status(200).json(imprenditore);
    } catch (error) {
        console.error('Errore durante il recupero dell\'imprenditore:', error.message);
        res.status(500).send('Errore del server');
    }
});

module.exports = router;