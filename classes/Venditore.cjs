const Imprenditore = require('./Imprenditore.cjs');


class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email, password, datiPagamento){
        super(name, surname, birthdate, email, password);
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