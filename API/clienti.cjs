const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const router = express.Router();
const DBClient=require('../models/clientModel.cjs');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;

router.get('/:id', async (req, res) => {
    try {
        const cliente = await DBClient.findById(req.params.id);
        if (!cliente) {
            console.log("Cliente non trovato!");
            return res.status(404).send('Cliente non trovato');
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error('Errore durante il recupero del cliente:', error);
        res.status(500).send('Errore del server');
    }
});

router.delete('/:id', tokenChecker('Cliente'), async (req, res) => {
    try {
        const cliente = await DBClient.findByIdAndDelete(req.params.id);
        if (!cliente) {
            console.log("Cliente non trovato!");
            return res.status(404).send('Cliente non trovato');
        }
        res.status(200).send('Cliente eliminato con successo');
    } catch (error) {
        console.error('Errore durante l\'eliminazione del cliente:', error);
        res.status(500).send('Errore del server');
    }
});

router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email richiesta' });
        const client = await DBClient.findOne({ email: email });
        if (!client) {
            return res.status(404).json({ error: 'Cliente non trovato' });
        }
        res.status(200).json(client);
    } catch (error) {
        console.error('Errore durante il recupero dell account cliente:', error);
        res.status(500).json({ error: 'Errore del server' });
}});

module.exports = router;