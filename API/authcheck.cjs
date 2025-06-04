const express = require('express');
const path = require('path');
const { tokenChecker } = require("../tokenchecker.cjs");
const router = express.Router();

router.get('/interfacciavenditore', tokenChecker('Venditore'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'interfaccia-venditore.html'));
});

router.get('/carrello', tokenChecker('Cliente'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'carrello.html'));
});

router.get('/dettagliaccount', tokenChecker('Cliente'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'dettagli-account.html'));
});

router.get('/addPromo', tokenChecker('Imprenditore'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'aggiungi-promo.html'));
});

router.get('/consegne', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'ordini-admin.html'));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'dettagli-account.html'));
});

router.get('/upgrade', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'registrazione-venditore.html'));
});

router.get('/candidature', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'candidature.html'));
});

module.exports = router;