const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('../services/VenditoreService.cjs');
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBVendor = require('../models/vendorModel.cjs');

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


router.put('/descrizione/:id', tokenChecker('Venditore'), async (req, res) => {
    try {
        const { descrizione } = req.body;
        const id = req.params.id;
        const venditoreAggiornato = await VenditoreServizio.updateDescrizione(descrizione, id);
        res.status(200).json(venditoreAggiornato);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della descrizione:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.put('/sede/:id', tokenChecker('Venditore'), async (req, res) => {
    try {
        const { sede } = req.body;
        const id = req.params.id;
        const venditoreAggiornato = await VenditoreServizio.updateSede(sede, id);
        res.status(200).json(venditoreAggiornato);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'indirizzo:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.post('/registrazione', async (req, res) => {
    try {
        const { _id, nome, cognome, birthdate, email, username, password, sede, descrizione, tipo, datiPagamento, carrello } = req.body;
        const venditoreRegistrato = new DBVendor({
            _id: _id,
            nome: nome,
            cognome: cognome,
            birthdate: birthdate,
            email: email,
            username: username,
            password: password, //await hashPassword(password) è già hashata
            sede: sede,
            descrizione: descrizione,
            tipo: tipo,
            datiPagamento: datiPagamento,
            carrello: carrello
        });
        await venditoreRegistrato.save();
        res.status(201).json(venditoreRegistrato);
    } catch (error) {
        console.error('Errore durante la registrazione del venditore:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});


module.exports = router;