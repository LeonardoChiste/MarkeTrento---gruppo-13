const express = require('express');
const path = require('path');
const { tokenChecker } = require("../tokenchecker.cjs");
const { default: Imprenditore } = require('../classes/Imprenditore.cjs');
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

router.get('/ordini', tokenChecker('Admin'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'ordini-admin.html'));
});

router.get('/admin', tokenChecker('Admin'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'dettagli-account.html'));
});

router.get('/upgrade', tokenChecker('Imprenditore'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'registrazione-venditore.html'));
});

router.get('/candidature', tokenChecker('Admin'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'candidature.html'));
});

router.get('/consegne', tokenChecker('Admin'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'consegne-admin.html'));
});

router.get('/addConsegna', tokenChecker('Admin'), (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'consegna-nuova.html'));
});


module.exports = router;