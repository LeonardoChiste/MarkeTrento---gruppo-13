const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const multer = require('multer');
const DBPromotion=require('../models/promotionModel.cjs');
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit to 5MB

//api promozioni
router.get('', async (req, res) => {
    try {
        const promotions = await DBPromotion.find();
        const formattedPromotions = promotions.map(promo => {
            let imgSrc = '';
            if (promo.img && promo.img.data) {
                const base64 = promo.img.data.toString('base64');
                imgSrc = `data:${promo.img.contentType};base64,${base64}`;
            }
            return {
                ...promo.toObject(),
                data: promo.data ? promo.data.toISOString().split('T')[0] : null,
                img: imgSrc
            };
        });
        res.status(200).json(formattedPromotions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('', upload.single('image'), tokenChecker('Imprenditore'), async (req, res) => {
    try {
        const data = req.body;
        const promozione = new DBPromotion({
            data: data.startdate,
            titolo: data.title,
            promotore: data.promoter,
            descrizione: data.description,
            img: {
                data: req.file.buffer, 
                contentType: req.file.mimetype 
            },
            tipoAnnuncio: data.tipo
        });
        await promozione.save();
        res.status(201).json({ message: 'Promozione creata con successo' });
    } catch (error) {
        console.error('Errore durante la creazione della promozione:', error);
        res.status(500).json({ error: 'Errore durante la creazione della promozione' });
    }
});

module.exports = router;