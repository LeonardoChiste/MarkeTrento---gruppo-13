const Prodotto = require('./prodotto.cjs');

/* Alla fine non usiamo la classe locale ma 
la lasciamo per eventuali modifiche future e per completezza */

class Carrello {
    constructor() {
        this.prodotti = []; // Array per contenere i prodotti nel carrello
    }

    // Aggiunge un prodotto al carrello
    aggiungiProdotto(prodotto) {
    const existing = this.prodotti.find(p => p.nome === prodotto.nome);
    if (existing) {
        existing.quantity += 1; 
    } else {
        this.prodotti.push({
            nome: prodotto.nome,
            prezzo: prodotto.prezzo,
            quantity: 1 // Valore di default per la quantità
        });
    }
}

    // Mostra i prodotti nel carrello
    visualizzaProdotti() {
        if (this.prodotti.length === 0) {
            console.log("Il carrello è vuoto.");
        } else {
            console.log("Prodotti nel carrello:");
            this.prodotti.forEach((prodotto, index) => {
                console.log(`${index + 1}. ${prodotto.nome} - Prezzo: €${prodotto.prezzo}`);
            });
        }
    }

    // Rimuove un prodotto dal carrello (per nome)
    rimuoviProdotto(nomeProdotto) {
        const index = this.prodotti.findIndex(prodotto => prodotto.nome === nomeProdotto);
        if (index !== -1) {
            const prodottoRimosso = this.prodotti.splice(index, 1)[0];
            console.log(`Prodotto rimosso: ${prodottoRimosso.nome}`);
        } else {
            console.log(`Prodotto "${nomeProdotto}" non trovato nel carrello.`);
        }
    }

     // Svuota il carrello
    svuotaCarrello() {
        this.prodotti = [];
        console.log("Il carrello è stato svuotato.");
    }

    // Calcola il prezzo totale dei prodotti nel carrello
    calcolaPrezzoTotale() {
        const totale = this.prodotti.reduce((somma, prodotto) => somma + prodotto.prezzo, 0);
        console.log(`Prezzo totale: €${totale.toFixed(2)}`);
        return totale;
    }
}

module.exports = Carrello;