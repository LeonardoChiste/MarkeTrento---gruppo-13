const Imprenditore = require('./Imprenditore.cjs');


class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email,username, password,sede,descrizione,tipo, datiPagamento){
        super(name, surname, birthdate, email,username, password,sede,descrizione,tipo);
        this.datiPagamento=datiPagamento;
        
    }
    async pubblicaProdotto(prod) {
       
    }

    async eliminaProdotto(nomeProdotto) {
    }

    async mostraProdotti() {
        //return await Prodotto.find({ venditore: this.name });
        return await Prodotto.find({ venditore: this.name });
    }
}

module.exports = Venditore;