const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('../services/VenditoreService.cjs');
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBVendor = require('../models/vendorModel.cjs');
const CarrelloServizio = require('../services/CarrrelloService.cjs');
const Productv2 = require('../models/productModel.cjs');

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

// Recupera carrello del venditore
router.get('/:id/carrello', async (req, res) => {
    try {
        const { id } = req.params;
        const Model = DBVendor;

        const carrello = await CarrelloServizio.getCarrello(Model, id);
        if (!carrello) {
            return res.status(404).send('Carrello non trovato');
        }
        res.status(200).json(carrello.prodotti);
    } catch (error) {
        console.error('Errore durante il recupero del carrello:', error);
        res.status(500).send('Errore del server');
    }
});

// Aggiungi prodotto al carrello
router.post('/:id/carrello/add', async (req, res) => {
    try {
        const { id } = req.params;
        const Model = DBVendor;

        const { _id, nome, prezzo, quantity } = req.body;
        const user = await Model.findById(id);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });

        // Recupera il prodotto dal database
        const prodotto = await Productv2.findById(_id);
        if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });

        // Tutti i prodotti nel carrello devono appartenere allo stesso venditore
        if (user.carrello.length > 0) {
            const firstProduct = user.carrello[0];
            const firstProductDb = await Productv2.findById(firstProduct._id);
            if (
                firstProductDb && firstProductDb.venditore &&
                prodotto.venditore &&
                String(firstProductDb.venditore) !== String(prodotto.venditore)
            ) {
                return res.status(400).json({
                    error: 'Tutti i prodotti nel carrello devono appartenere allo stesso venditore. Svuotare il carrello per inserire prodotti di questo venditore.'
                });
            }
        }

        // Recupera la quantita nel carrello
        const item = user.carrello.find(p => p.nome === nome);
        const currentQuantity = item ? item.quantity : 0;

        if (currentQuantity + quantity > prodotto.quantita) {
            return res.status(400).json({ error: 'Quantità totale nel carrello eccede la quantità disponibile' });
        }

        // Aggiungi il prodotto al carrello
        if (item) {
            item.quantity += quantity;
            if (!item._id) item._id = prodotto._id;
        } else {
            user.carrello.push({
                _id: prodotto._id,
                nome,
                prezzo,
                quantity
            });
        }
        await user.save();
        res.status(200).json({ message: 'Prodotto aggiunto al carrello' });
    } catch (error) {
        console.error('Errore in /carrelli/:userType/:userId/add:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

// Rimuovi un prodotto dal carrello
router.post('/:id/carrello/removeOne', async (req, res) => {
    try {
        const { id } = req.params;
        const Model = DBVendor;

        const { nome } = req.body;
        const user = await Model.findById(id);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });

        const item = user.carrello.find(p => p.nome === nome);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                user.carrello = user.carrello.filter(p => p.nome !== nome);
            }
            await user.save();
        }
        res.status(200).json({ message: 'Prodotto aggiornato' });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
});

// Svuota il carrello
router.post('/:id/carrello/clear', async (req, res) => {
    try {
        const { id } = req.params;
        const Model = DBVendor;

        const user = await Model.findById(id);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });

        user.carrello = [];
        await user.save();
        res.status(200).json({ message: 'Carrello svuotato' });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante lo svuotamento del carrello' });
    }
});

module.exports = router;