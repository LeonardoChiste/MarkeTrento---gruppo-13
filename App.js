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
class Venditore extends Cliente{
    constructor(name, surname, birthdate, email, password, tipo, datiPagamento){
        super(name, surname, birthdate, email, password);
        this.tipo=tipo;
        this.datiPagamento=datiPagamento;
    }
    pubblicaProdotto(prod){ }
    eliminaProdotto(prod){ }
}
class Promotore extends Cliente{
    constructor(name, surname, birthdate, email, password){
        this.name=name;
        this.surname=surname;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
    pubblicaAnnuncio(datiAnnuncio){ }
    eliminaAnnuncio(annuncio){ }
}
