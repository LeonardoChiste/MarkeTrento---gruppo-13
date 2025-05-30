const Utente = require('./Utente.cjs');
const Carrello = require('./Carrello.cjs');
const { addProductToCarrello, removeProductFromCarrello } = require('../services/CarrrelloService.cjs');


class Cliente extends Utente {
    constructor(name, surname, birthdate, email, username, password) {
        super();
        this.nome = name;
        this.cognome = surname;
        this.username = username;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.carrello = new Carrello();
    }


    //Aggiunge un prodotto al carrello e lo salva nel database
    async aggiungiProdottoAlCarrello(prodotto) {
        // Aggiorna carrello locale
        this.carrello.aggiungiProdotto(prodotto);

        // Aggiorna carrello nel database
        await addProductToCarrello(this.id, prodotto);
    }

    // Rimuove un prodotto dal carrello e aggiorna il database (stessa logica di aggiungiProdottoAlCarrello)
    async rimuoviProdottoDalCarrello(nomeProdotto) {
        this.carrello.rimuoviProdotto(nomeProdotto);
        await removeProductFromCarrello(this.id, nomeProdotto);
    }

    visualizzaProdotto() { }

    visualizzaOrdini() { }

    visualizzaCarrello() {
        this.carrello.visualizzaProdotti();
    }
}

module.exports = Cliente;