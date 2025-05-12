const Cliente = require('./Cliente.cjs');

class Imprenditore extends Cliente {
    constructor(name, surname, birthdate, email, password, sede, descrizione, tipo) {
        super(name, surname, birthdate, email, password);
        this.indirizzo = sede;
        this.descrizione = descrizione;
        this.tipo = tipo;
    }

    pubblicaAnnuncio(datiAnnuncio) { }

    eliminaAnnuncio(annuncio) { }
}

module.exports = Imprenditore;