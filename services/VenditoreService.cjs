const DBVendor = require('../models/vendorModel.cjs'); // Assicurati che il path sia corretto

async function getAllVenditori() {
    try {
        const venditori = await DBVendor.find({});
        return venditori;
    } catch (error) {
        console.error('Errore nel recupero dei venditori:', error);
        throw error;
    }
}

async function getVendorById(id) {
    try {
        const venditore = await DBVendor.findById(id);
        return venditore;
    } catch (error) {
        console.error('Errore nel recupero del venditore per ID:', error);
        throw error;
    }
}

module.exports = {
    getAllVenditori,getVendorById
    // Aggiungi altre funzioni se necessario
};