const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('../services/VenditoreService.cjs');
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBVendor = require('../models/vendorModel.cjs');
const Recensione = require('../models/recensioneModel.cjs');
const Order = require('../models/orderModel.cjs');
const ProdottoServizio = require('../services/ProdottoService.cjs');


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


router.put('/:id/descrizione', tokenChecker('Venditore'), async (req, res) => {
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

router.put('/:id/sede', tokenChecker('Venditore'), async (req, res) => {
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


router.get('/:venditoreId/recensioni', async (req, res) => {   
    try {
        const venditoreId = req.params.venditoreId;
        // Trova tutti gli ordini di questo venditore
        const orders = await Order.find({ venditore: venditoreId }).select('_id');
        const orderIds = orders.map(o => o._id);
        // Trova tutte le recensioni per questi ordini
        const recensioni = await Recensione.find({ ordine: { $in: orderIds } });
        res.status(200).json(recensioni);
    } catch (err) {
        console.error('Errore caricamento recensioni:', err);
        res.status(500).json({ error: 'Errore durante il caricamento delle recensioni.' });
    }
});

router.get('/:id/prodotti', async (req, res) => {
    try {
        const prodotto = await ProdottoServizio.getProductByVendor(req.params.id);
        if (!prodotto) {
            return res.status(404).send('Prodotto non trovato');
        }
        res.status(200).json(prodotto);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).send('Errore del server');
    }
});

router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email richiesta' });
        const vendor = await DBVendor.findOne({ email: email });
        if (!vendor) {
            return res.status(404).json({ error: 'Venditore non trovato' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error('Errore durante il recupero del venditore:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.get('/:id/orders', async (req, res) => {
    try {
        const venditoreId = req.params.id;
        const orders = await Order.find({ venditore: venditoreId });
        const now = new Date();
        const twentyOneDaysAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

        const filteredOrders = orders.filter(order => {
            if (order.stato === 'Rifiutato') return false;
            if (
            (order.stato === 'Consegnato' || order.stato === 'Ritirato') &&
            order.pubblicazione < twentyOneDaysAgo
            ) {
            return false;
            }
            else return true;
        });
        res.json(filteredOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero degli ordini per il venditore' });
    }
});

module.exports = router;