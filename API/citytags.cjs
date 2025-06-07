const express = require('express');
const router = express.Router();
const CityTags = require('../models/citytagsModel.cjs');

router.get('/', async (req, res) => {
    try {
        const tags = await CityTags.find();
        res.status(200).json(tags);
    } catch (err) {
        res.status(500).json({ error: 'Errore durante il recupero dei city tags' });
    }
});

module.exports = router;