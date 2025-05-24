const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const TagServizio=require('./services/tagService.cjs');
const router = express.Router();

router.get('', async (req, res) => {
    try {
        const tagsDoc = await TagServizio.getTags();
        res.status(200).json(tagsDoc ? tagsDoc.tags : []);
    } catch (error) {
        console.error('Errore durante il recupero dei tag:', error.message);
        res.status(500).json({ error: 'Errore del server' });
    }
});
module.exports = router;