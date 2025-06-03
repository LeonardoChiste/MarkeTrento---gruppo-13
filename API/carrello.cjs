const express = require('express');
require('dotenv').config({ path: 'process.env' });
const CarrelloServizio = require('../services/CarrrelloService.cjs');
const Productv2 = require('../models/productModel.cjs');
const DBClient = require('../models/clientModel.cjs');
const DBVendor = require('../models/vendorModel.cjs');
const DBEntrepreneur = require('../models/promoterModel.cjs');
const router = express.Router();

function getModelByUserType(userType) {
    if (userType === 'cliente') return DBClient;
    if (userType === 'venditore') return DBVendor;
    if (userType === 'imprenditore') return DBEntrepreneur;
    return null;
}

// Recupera il carrello
router.get('/:userType/:userId', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const Model = getModelByUserType(userType);
        if (!Model) return res.status(400).json({ error: 'Tipo utente non valido' });

        const carrello = await CarrelloServizio.getCarrello(Model, userId);
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
router.post('/:userType/:userId/add', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const Model = getModelByUserType(userType);
        if (!Model) return res.status(400).json({ error: 'Tipo utente non valido' });

        const { _id, nome, prezzo, quantity } = req.body;
        const user = await Model.findById(userId);
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

// Rimuovi una quantità di un prodotto dal carrello
router.post('/:userType/:userId/removeOne', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const Model = getModelByUserType(userType);
        if (!Model) return res.status(400).json({ error: 'Tipo utente non valido' });

        const { nome } = req.body;
        const user = await Model.findById(userId);
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
router.post('/:userType/:userId/clear', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const Model = getModelByUserType(userType);
        if (!Model) return res.status(400).json({ error: 'Tipo utente non valido' });

        const user = await Model.findById(userId);
        if (!user) return res.status(404).json({ error: 'Utente non trovato' });

        user.carrello = [];
        await user.save();
        res.status(200).json({ message: 'Carrello svuotato' });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante lo svuotamento del carrello' });
    }
});

module.exports = router;