const Imprenditore= require('../models/promoterModel.cjs');

async function updateDescrizione(descrizione,ID) {
    try {
        const imprenditoreAggiornato = await Imprenditore.findByIdAndUpdate(
            ID,
            { descrizione },
            { new: true }
        );
        if (!imprenditoreAggiornato) {
            throw new Error('Imprenditore non trovato');
        }
        return imprenditoreAggiornato;
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della descrizione:', error.message);
        throw error;
    }
}

async function updateSede(sede,ID) {
    try {
        const imprenditoreAggiornato = await Imprenditore.findByIdAndUpdate(
            ID,
            { sede },
            { new: true }
        );
        if (!imprenditoreAggiornato) {
            throw new Error('Imprenditore non trovato');
        }
        return imprenditoreAggiornato;
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'indirizzo:', error.message);
        throw error;
    }
}

module.exports = {
    updateDescrizione,
    updateSede
};