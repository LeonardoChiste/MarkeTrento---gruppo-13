const Imprenditore = require('./Imprenditore.cjs');

class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email, password, datiPagamento){
        super(name, surname, birthdate, email, password);
        this.datiPagamento=datiPagamento;
        
    }
    pubblicaProdotto(prod){ 
         
    }
    
    eliminaProdotto(prod){ 
        
    }
}

module.exports = Venditore;