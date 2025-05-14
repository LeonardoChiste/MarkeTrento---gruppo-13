const Client = require('../models/clientModel.cjs');
const Carrello = require('../classes/Carrello.cjs');

// Aggiunge un prodotto al carrello di un cliente
async function addProductToCarrello(clientId, product) {
    const client = await Client.findById(clientId);
    if (client) {
        // Carrello da database a oggetto
        const carrello = new Carrello();
        carrello.prodotti = client.carrello;

        // Aggiungi prodotto al carrello usando il metodo
        carrello.aggiungiProdotto(product);

        // Oggetto carrello a database
        client.carrello = carrello.prodotti;
        await client.save();

        console.log("Product added to carrello:", product);
    } else {
        console.log("Client not found");
    }
}

// Recupera il carrello di un cliente
async function getClientCarrello(clientId) {
    const client = await Client.findById(clientId);
    if (client) {
        const carrello = new Carrello();
        carrello.prodotti = client.carrello.map(prodotto => ({
            nome: prodotto.nome || 'Prodotto sconosciuto',
            prezzo: prodotto.prezzo || 0
        }));

        console.log("Carrello:", carrello);
        return carrello;
    } else {
        console.log("Client not found");
        return null;
    }
}

// Rimuove un prodotto dal carrello di un cliente
async function removeProductFromCarrello(clientId, nomeProdotto) {
    const client = await Client.findById(clientId);
    if (client) {
        // Carrello da database a oggetto
        const carrello = new Carrello();
        carrello.prodotti = client.carrello;

        // Rimuovi prodotto dal carrello usando il metodo
        carrello.rimuoviProdotto(nomeProdotto);

        // Oggetto carrello a database
        client.carrello = carrello.prodotti;
        await client.save();

        console.log(`Product "${nomeProdotto}" removed from carrello.`);
    } else {
        console.log("Client not found");
    }
}

module.exports = { addProductToCarrello, getClientCarrello, removeProductFromCarrello };