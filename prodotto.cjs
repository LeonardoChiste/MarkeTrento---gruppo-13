const express =require( 'express');
require('dotenv').config({ path: 'process.env' });

const Prodotto = require('./classes/prodotto.cjs');
const ProdottoServizio = require('./services/ProdottoService.cjs');
const router = express.Router();

//api prodotti
router.get('/venditore/:id', async (req, res) => {
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

router.get('/:id', async (req, res) => {
    try {
        const prodotto = await ProdottoServizio.getProductById(req.params.id);
        if (!prodotto) {
            return res.status(404).send('Prodotto non trovato');
        }
        res.status(200).json(prodotto);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).send('Errore del server');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {  descrizione, quantita} = req.body;
        await ProdottoServizio.updateProduct(descrizione, quantita, id);
        res.status(200).json({ message: 'Prodotto aggiornato con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
router.post('', async (req, res) => {
    try {
        const { nome, descrizione, venditore, costo, quantita, tag } = req.body;
        const prodotto = new Prodotto(nome, descrizione, venditore, costo, quantita, tag);
        await ProdottoServizio.addProduct(prodotto);
        res.status(201).json({ message: 'Prodotto aggiunto con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await ProdottoServizio.deleteProduct(id);
        res.status(200).json({ message: 'Prodotto eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
module.exports = router;