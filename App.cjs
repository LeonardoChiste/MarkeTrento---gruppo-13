
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

class Utente
{

}

class Cliente extends Utente {
    constructor(name, surname, birthdate, email, username, password){
        this.name=name;
        this.surname=surname;
        this.username=username;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
}
//intanto non specifico nulla ma cambio solo ereditarietà
class Imprenditore extends Cliente{
    constructor(name, surname, birthdate, email, password,sede,descrizione,tipo){
     super(name,surname,birthdate,email,password)
     this.indirizzo=sede;
     this.descrizione=descrizione;
     this.tipo=tipo;
    }
    pubblicaAnnuncio(datiAnnuncio){ }
    eliminaAnnuncio(annuncio){ }
}

class Venditore extends Imprenditore{
    constructor(name, surname, birthdate, email, password, datiPagamento){
        super(name, surname, birthdate, email, password);
        this.datiPagamento=datiPagamento;
    }
    pubblicaProdotto(prod){ }
    eliminaProdotto(prod){ }
}

module.exports = {Cliente}
