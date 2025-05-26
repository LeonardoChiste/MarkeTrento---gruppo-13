const Imprenditore= require('../classes/Imprenditore.cjs');

async function updateDescrizione(descrizione,email) {
    try {
        const imprenditoreAggiornato = await Imprenditore.findByIdAndUpdate(
            id,
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

async function updateSede(sede,email) {
    try {
        const imprenditoreAggiornato = await Imprenditore.findByIdAndUpdate(
            id,
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