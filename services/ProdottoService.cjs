const Product = require('../models/productModel.cjs'); 

// Recupera un prodotto per ID
async function getProductById(id) {
    try {
        const prodotto = await Product.findById(id); 
        if (!prodotto) {
            throw new Error('Prodotto non trovato');
        }
        return prodotto;
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error.message);
        throw error;
    }
}

module.exports = { getProductById };