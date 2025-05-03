//commit di Leonardo
const Stato = {
    InElaborazione,
    Spedito,
    Consegnato,
    Rifiutato
}
const Tannuncio={
    Evento, Promozione
}
const Tazienda={
    Ristorante, 
    Bar,
    Locale,
    ProLoco,
    Altro,
    Cooperativa,
    Impresa,
    Malga,
    Fattoria,
    AziendaAgricola,
    Agricoltore,
    Allevatore
}
const Tprodotto = {
    Mele,
    Pere,
    FruttiBosto,
    Castagne,
    Asparagi,
    Ciliege,
    Olio,
    Alcolici,
    Gastronomia, 
    Sughi, 
    Tuberi, 
    Carne, 
    Pesce, 
    Formaggi, 
    Miele, 
    Bevande, 
    Dolci, 
    Salumi, 
    Funghi, 
    AltraFrutta
}
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
