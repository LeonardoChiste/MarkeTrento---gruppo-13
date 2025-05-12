import Imprenditore from "./App.cjs"

class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email, password, datiPagamento){
        super(name, surname, birthdate, email, password);
        this.datiPagamento=datiPagamento;
        
    }
    pubblicaProdotto(prod){ 
        //funzione che aggiunge su database, la api grafica la fai da un altra parte
    }
    eliminaProdotto(prod){ 
        //togli da database
    }
}