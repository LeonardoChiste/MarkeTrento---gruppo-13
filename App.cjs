class PagaDati{
    constructor(idConto){
        this.idConto=idConto;
    }
}

class Utente {  //metto delle robe di default per utenti non registrati
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
        this.name=name;
        this.surname=surname;
        this.username=username;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
    acquista(){ }
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


class Admin extends Utente{
    constructor(name, surname, birthdate, email, username, password){
        super()
        this.name=name;
        this.surname=surname;
        this.username=username;
        this.birthdate=birthdate;
        this.email=email;
        this.password=password;
    }
    visualizzaCandidature(){ }
}

module.exports = {Cliente}
