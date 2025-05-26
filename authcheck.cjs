const express = require('express');
const path = require('path');
const { tokenChecker } = require("./tokenchecker.cjs");
const router = express.Router();

router.get('/', tokenChecker('Venditore'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'interfacciavenditore.html'));
});

module.exports = router;