const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const multer = require('multer');
const DBPromotion=require('./models/promotionModel.cjs');
const router = express.Router();

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//api promozioni
router.get('', async (req, res) => {
    try {
        /*const promotions = await DBPromotion.find();
        // Format the data field as 'YYYY-MM-DD'
        const formattedPromotions = promotions.map(promo => ({
            ...promo.toObject(),
            data: promo.data ? promo.data.toISOString().split('T')[0] : null
        }));
        res.status(200).json(formattedPromotions);*/
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
router.post('', async (req, res) => {
    /*const data = req.body;
    let imgBuffer = null;
    const encoded = image ? image.toString('base64') : null;
    const promozione = DBPromotion({
        data: data.startdate,
        titolo: data.title,
        promotore: data.promoter,
        descrizione: data.description,
        img: body.image,
        tipoAnnuncio: data.tipo
    });
    console.log(promozione);
    await DBPromotion.create(promozione).then(() => {
        console.log('Promozione creata con successo');
        res.status(201).json({ message: 'Promozione creata con successo' });
    }).catch((error) => {   
        console.error('Errore durante la creazione della promozione:', error);
        res.status(500).json({ error: 'Errore durante la creazione della promozione' });
    });*/
    try {
        const data = req.body;
        /*let imgBuffer = null;
        if (data.image) {
            // Remove data URL prefix if present
            const base64 = data.image;//.split(',').pop();
            imgBuffer = Buffer.from(base64, 'base64');
        }*/
        const promozione = new DBPromotion({
            data: data.startdate,
            titolo: data.title,
            promotore: data.promoter,
            descrizione: data.description,
            img: {
                data: data.image ? Buffer.from(data.image, 'base64') : undefined,
                contentType: data.imageType || 'image/png'
            },
            //img: imgBuffer,
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