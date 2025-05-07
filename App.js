//commit di Leonardo
//scritto malissimo, cancella tutto 
class Prodotto{
    constructor(nome, descrizione){
        this.nome=nome;
        this.descrizione=descrizione;
    }
}
class PagaDati{
    constructor(idConto){
        this.idConto=idConto;
    }
}


class Cliente {
    constructor(name, surname, birthdate, email, password){
        this.name=name;
        this.surname=surname;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
}
//intanto non specifico nulla ma cambio solo ereditarietà
//Ma nel diagramma UML delle classi non c'è imprenditore, da dove salta fuori? -Leonardo
class Imprenditore extends Cliente{
    constructor(name, surname, birthdate, email, password){
     super(name,surname,birthdate,email,password)
    }
    pubblicaAnnuncio(datiAnnuncio){ }
    eliminaAnnuncio(annuncio){ }
}

class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email, password, tipo, datiPagamento){
        super(name, surname, birthdate, email, password);
        this.tipo=tipo;
        this.datiPagamento=datiPagamento;
    }
    pubblicaProdotto(prod){ }
    eliminaProdotto(prod){ }
}
