const DBClient = require('../models/clientModel.cjs');
const Carrello = require('../classes/Carrello.cjs');
const Cliente = require('../classes/Cliente.cjs');
const DBVendor = require('../models/vendorModel.cjs');
const DBEntrepreneur = require('../models/promoterModel.cjs');

// Aggiunge un prodotto al carrello di un cliente
async function addProductToCarrello(model, userId, product) {
    const client = await model.findById(userId);
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
async function getCarrello(model, userId) {
    const user = await model.findById(userId);
    if (user) {
        const carrello = new Carrello();
        carrello.prodotti = user.carrello
            .filter(prodotto => prodotto && prodotto._id)
            .map(prodotto => ({
                _id: prodotto._id,
                nome: prodotto.nome || 'Prodotto sconosciuto',
                prezzo: prodotto.prezzo || 0,
                quantity: prodotto.quantity || 1
            }));
        return carrello;
    } else {
        return null;
    }
}

// Rimuove un prodotto dal carrello di un 
async function removeProductFromCarrello(model, userId, nomeProdotto) {
    const client = await model.findById(userId);
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

async function nuovaregistrazione(cliente) {
    var email1 = cliente.email.toLowerCase();
    var username1 = cliente.username.toLowerCase();
    const [existingClient, existingVendor, existingEntrepreneur] = await Promise.all([
        DBClient.findOne({ $or: [{ email: email1 }, { username: username1 }] }),
        DBVendor.findOne({ $or: [{ email: email1 }, { username: username1 }] }),
        DBEntrepreneur.findOne({ $or: [{ email: email1 }, { username: username1 }] })
    ]);

    if (existingClient) {
        const msg = `Cliente già registrato con email o username: ${email1}, ${username1}`;
        console.log(msg);
        return { success: false, error: msg };
    }

    if (existingVendor) {
        const msg = `Venditore già registrato con email o username: ${email1}, ${username1}`;
        console.log(msg);
        return { success: false, error: msg };
    }

    if (existingEntrepreneur) {
        const msg = `Imprenditore già registrato con email o username: ${email1}, ${username1}`;
        console.log(msg);
        return { success: false, error: msg };
    }
    try {
        cliente.email = email1;
        cliente.username = username1;
        cliente.carrello = Array.isArray(cliente.carrello) ? cliente.carrello : [];
        const daSalvare = new DBClient(cliente);
        await daSalvare.save();
        const msg = "Registrazione completata con successo!";
        console.log(msg);
        return { success: true, message: msg };
    } catch (error) {
        const msg = `Errore durante la registrazione del cliente: ${error}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}

async function getClienteById(id) {
    try {
        const cliente = await DBClient.findById(id);
        if (!cliente) {
            console.log("Cliente non trovato");
            return null;
        }
        return cliente;
    } catch (error) {
        console.error("Errore durante il recupero del cliente:", error);
        return null;
    }
}


module.exports = { addProductToCarrello, getCarrello, removeProductFromCarrello, nuovaregistrazione };