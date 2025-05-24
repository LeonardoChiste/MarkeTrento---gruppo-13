const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const DBPromotion=require('./models/promotionModel.cjs');
const router = express.Router();

//api promozioni
router.get('', async (req, res) => {
    try {
        const promotions = await DBPromotion.find();
        // Format the data field as 'YYYY-MM-DD'
        const formattedPromotions = promotions.map(promo => ({
            ...promo.toObject(),
            data: promo.data ? promo.data.toISOString().split('T')[0] : null
        }));
        res.status(200).json(formattedPromotions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('', async (req, res) => {
    const data = req.body;
    const promozione = DBPromotion({
        data: data.startdate,
        titolo: data.title,
        promotore: data.promoter,
        descrizione: data.description,
        img: data.image,
        tipoAnnuncio: data.tipo
    });
    console.log(promozione);
    await DBPromotion.create(promozione).then(() => {
        console.log('Promozione creata con successo');
        res.status(201).json({ message: 'Promozione creata con successo' });
    }).catch((error) => {   
        console.error('Errore durante la creazione della promozione:', error);
        res.status(500).json({ error: 'Errore durante la creazione della promozione' });
    });
});

module.exports = router;