const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const multer = require('multer');
const Productv2 = require('../models/productModel.cjs'); 
const Prodotto = require('../classes/prodotto.cjs');
const ProdottoServizio = require('../services/ProdottoService.cjs');
const FotoProdottoServizio = require('../services/fotoProdotto.cjs');
const router = express.Router();
const DBPictureProduct = require('../models/pictureProductModel.cjs');
//const { default: pictureProductModel } = require('../models/pictureProductModel.cjs');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit to 5MB

//api prodotti
/*
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
});*/

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
        res.status(201).json({ message: 'Prodotto aggiunto con successo'});
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});
router.post('', async (req, res) => {
    try {
        const { nome, descrizione, venditore, costo, quantita, tag } = req.body;
        const prodotto = new Prodotto(nome, descrizione, venditore, costo, quantita, tag);
        const nuovoProdotto = await ProdottoServizio.addProduct(prodotto);
        res.status(201).json({ id: nuovoProdotto._id });
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

router.post('/:id/foto', upload.single('image'), async (req, res) => {
    try {
        /*const id = req.params.id;
        var foto = req.file.buffer;
        var ct = req.file.mimetype;*/
        console.log(req.params.id);
        const image = new DBPictureProduct ({
            prodottoId: String(req.params.id),
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });
        image.save();
        //await FotoProdottoServizio.addProductImage(id, foto ,ct)
        res.status(200).json({ message: 'Foto del prodotto aggiornata con successo' });
    }
    catch (error) {
        console.error('Errore durante l\'aggiunta della foto del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});

router.get('/:id/foto', async (req, res) => {
    try {
        const foto = await DBPictureProduct.findOne( {prodottoId : req.params.id} );
        if (!foto) {
            return res.status(404).send('Foto non trovata');
        }
        res.set('Content-Type', foto.img.contentType);
        res.status(200).send(foto.img.data);
    }
    catch (error) {
        console.error('Errore durante il recupero della foto del prodotto:', error);
        res.status(500).send('Errore del server');
    }
});

module.exports = router;
