const Productv2 = require('../models/productModel.cjs'); 

// Recupera un prodotto per ID
async function getProductById(id) {
    try {
        const prodotto = await Productv2.findById(id); 
        if (!prodotto) {
            throw new Error('Prodotto non trovato');
        }
        return prodotto;
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error.message);
        throw error;
    }
}

// funzione per recuperare i prodotti di un venditore
async function getProductByVendor(vend) {
    try {
        // Se vend è un ObjectId, puoi convertirlo in stringa con .toString()
        // Ma per confrontare con il campo 'venditore' in MongoDB, è meglio passare direttamente l'ObjectId o la stringa corretta
        const prodotti = await Productv2.find({ venditore: vend});
        return prodotti;
    } catch (error) {
        console.error('Errore durante il recupero dei prodotti del venditore:', error.message);
        throw error;
    }
}

module.exports = { getProductById,getProductByVendor};