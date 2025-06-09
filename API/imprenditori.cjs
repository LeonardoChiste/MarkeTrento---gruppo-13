const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const router = express.Router();
const DBEntrepreneur=require('../models/promoterModel.cjs');
const CarrelloServizio = require('../services/CarrrelloService.cjs');
const Productv2 = require('../models/productModel.cjs');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;



router.get('', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email richiesta' });
        const imprenditore = await DBEntrepreneur.findOne({ email: email });
        if (!imprenditore) {
            return res.status(404).json({ error: 'Imprenditore non trovato' });
        }
        res.status(200).json(imprenditore);
    } catch (error) {
        console.error('Errore durante il recupero dell imrenditore', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.put('/:id/descrizione', tokenChecker('Imprenditore'), async (req, res) => {
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
router.put('/:id/sede', tokenChecker('Imprenditore'), async (req, res) => {
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

router.delete('/:id', tokenChecker('Imprenditore'), async (req, res) => {
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
//recupera il carrello dell'imprenditore
router.get('/:id/carrello', async (req, res) => {
    try {
        const { id } = req.params;
        const Model = DBEntrepreneur;

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
        const Model = DBEntrepreneur;

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
        const Model = DBEntrepreneur;

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
        const Model = DBEntrepreneur;

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