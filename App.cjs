
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
    Utente(){}
class Utente {
   constructor(){
       this.name="-"
       this.surname="-"
       this.username="User"
       this.birthdate=new Date(1900-1-1)
       this.email=null
       this.password=null
   }
}

class Cliente extends Utente {
    constructor(name, surname, birthdate, email, username, password){
        super()
        super()
        this.name=name;
        this.surname=surname;
        this.username=username;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
}
//intanto non specifico nulla ma cambio solo ereditarietà
//Ma nel diagramma UML delle classi non c'è imprenditore, da dove salta fuori? -Leonardo
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
