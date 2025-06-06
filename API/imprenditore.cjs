const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBEntrepreneur = require('../models/promoterModel.cjs');

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

router.post('/add', tokenChecker('Cliente'), async (req, res) => {
    try {
        const imprenditore = new DBEntrepreneur(req.body);
        await imprenditore.save();
        res.status(201).json(imprenditore);
    } catch (error) {
        console.error('Errore durante la creazione dell\'imprenditore:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});
router.put('/sede/:id', tokenChecker('Imprenditore'), async (req, res) => {
    try {
        const { sede } = req.body;
        const id = req.params.id;
        const imprenditoreAggiornato = await ImprenditoreServizio.updateSede(sede, id);  //no imprenditore servizio
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

router.delete('/:id', async (req, res) => {
    try {
        const imprenditore = await DBEntrepreneur.findByIdAndDelete(req.params.id);
        if (!imprenditore) {
            return res.status(404).send('Imprenditore non trovato');
        }
        res.status(200).send('Imprenditore eliminato con successo');
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'imprenditore:', error.message);
        res.status(500).send('Errore del server');
    }
});

module.exports = router;