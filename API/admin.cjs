const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const router = express.Router();
const DBAdmin=require('../models/adminModel.cjs');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;

router.get('/:id', async (req, res) => {
    try {
        const cliente = await DBAdmin.findById(req.params.id);
        if (!cliente) {
            console.log("Admin non trovato!");
            return res.status(404).send('Admin non trovato');
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error('Errore durante il recupero admin:', error);
        res.status(500).send('Errore del server');
    }
});
router.post('/', async (req, res) => {
    try {
        const { nome, cognome, birthdate, email, username, password } = req.body;
        const existingAdmin = await DBAdmin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin già esistente con questa email' });
        } else {
            const hashedPassword = await hashPassword(password);
            const newAdmin = new DBAdmin({
                nome,
                cognome,
                birthdate,
                email,
                username,
                password: hashedPassword
            });
            await newAdmin.save();
            res.status(201).json({ message: 'Admin creato con successo' });
        }  
    } catch (error) {
        console.error('Errore durante la creazione dell\'admin:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
module.exports = router;