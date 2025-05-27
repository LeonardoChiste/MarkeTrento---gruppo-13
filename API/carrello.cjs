const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const ClienteServizio = require('../services/clienteService.cjs');
const Productv2=require('../models/productModel.cjs');  
const DBClient=require('../models/clientModel.cjs');
const router = express.Router();

//api carrello
router.get('/:clientId', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const carrello = await ClienteServizio.getClientCarrello(clientId); // Usa la funzione nella cartella services
        if (!carrello) {
            return res.status(404).send('Carrello non trovato');
        }
        res.status(200).json(carrello.prodotti); // Ritorna i prodotti nel carrello
    } catch (error) {
        console.error('Errore durante il recupero del carrello:', error);
        res.status(500).send('Errore del server');
    }
});

router.post('/:clientId/add', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const { nome, prezzo, quantity } = req.body;
        const client = await DBClient.findById(clientId);
        if (!client) return res.status(404).json({ error: 'Cliente non trovato' });

        // Recupera il prodotto dal database
        const prodotto = await Productv2.findOne({ nome });
        if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });

        //Tutti i prodotti nel carrello devono appartenere allo stesso venditore
        if (client.carrello.length > 0) {
            // Recupera il venditore del primo prodotto nel carrello
            const firstProduct = client.carrello[0];
            const firstProductDb = await Productv2.findOne({ nome: firstProduct.nome });
            if (firstProductDb && firstProductDb.venditore && prodotto.venditore && String(firstProductDb.venditore) !== String(prodotto.venditore)) {
                return res.status(400).json({ error: 'Tutti i prodotti nel carrello devono appartenere allo stesso venditore. Svuotare il carrello per inserire prodotti di questo venditore.' });
            }
        }

        // Recupera la quantita nel carrello
        const item = client.carrello.find(p => p.nome === nome);
        const currentQuantity = item ? item.quantity : 0;

        if (currentQuantity + quantity > prodotto.quantita) {
            return res.status(400).json({ error: 'Quantità totale nel carrello eccede la quantità disponibile' });
        }

        // Aggiungi il prodotto al carrello
        if (item) {
            item.quantity += quantity;
            //Aggiunge ID, se non presente
            if (!item._id) item._id = prodotto._id;
        } else {
            client.carrello.push({
                _id: prodotto._id, 
                nome, 
                prezzo, 
                quantity
             });
        }
        await client.save();
        res.status(200).json({ message: 'Prodotto aggiunto al carrello' });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.post('/:clientId/removeOne', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const { nome } = req.body;
        const client = await DBClient.findById(clientId);
        if (!client) return res.status(404).json({ error: 'Cliente non trovato' });
        const item = client.carrello.find(p => p.nome === nome);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                client.carrello = client.carrello.filter(p => p.nome !== nome);
            }
            await client.save();
        }
        res.status(200).json({ message: 'Prodotto aggiornato' });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.post('/:clientId/clear', async (req, res) => {
    try {
        const client = await DBClient.findById(req.params.clientId);
        if (!client) return res.status(404).json({ error: 'Cliente non trovato' });
        client.carrello = [];
        await client.save();
        res.json({ message: 'Carrello svuotato' });
    } catch (err) {
        res.status(500).json({ error: 'Errore durante lo svuotamento del carrello' });
    }
});

module.exports = router;