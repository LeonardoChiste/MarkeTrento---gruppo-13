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
module.exports = router;