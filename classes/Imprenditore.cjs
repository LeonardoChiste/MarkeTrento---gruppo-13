const Cliente = require('./Cliente.cjs');

class Imprenditore extends Cliente {
    constructor(name, surname, birthdate, email,username, password, sede, descrizione, tipo) {
        super(name, surname, birthdate, email, username, password);
        this.indirizzo = sede;
        this.descrizione = descrizione;
        this.tipo = tipo;
    }

    pubblicaAnnuncio(datiAnnuncio) { }

    eliminaAnnuncio(annuncio) { }
}

module.exports = Imprenditore;