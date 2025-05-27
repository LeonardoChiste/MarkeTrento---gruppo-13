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

async function updateDescrizione(descrizione, id) {
    try {
        const venditoreAggiornato = await DBVendor.findByIdAndUpdate(
            id,
            { descrizione: descrizione },
            { new: true } // Restituisce il documento aggiornato
        );
        return venditoreAggiornato;
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della descrizione del venditore:', error);
        throw error;
    }
}

async function updateSede(sede, id) {
    try {
        const venditoreAggiornato = await DBVendor.findByIdAndUpdate(
            id,
            { sede: sede },
            { new: true } // Restituisce il documento aggiornato
        );
        return venditoreAggiornato;
    }
    catch (error) {
        console.error('Errore durante l\'aggiornamento della sede del venditore:', error);
        throw error;
    }
}

module.exports = {
    getAllVenditori,getVendorById,updateDescrizione,updateSede
    // Aggiungi altre funzioni se necessario
};