const prodotto = require('../classes/prodotto.cjs'); 

// Fetches a product by its ID from the API
async function getProductById(id) {
    try {
        const response = await fetch(`/api/prodotti/${id}`);
        if (!response.ok) {
            throw new Error('Prodotto non trovato');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error.message);
        throw error;
    }
}

module.exports = { getProductById};