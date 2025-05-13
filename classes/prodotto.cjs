const mongoose = require ('mongoose');

class Prodotto{
    constructor(nome, descrizione,venditore,prezzo,qq,tag){
        this.nome=nome;
        this.descrizione=descrizione;
        this.venditore=venditore;
        this.quantita=qq;
        this.costo=prezzo;
        this.tag=tag;
        //tag come enum ossia array di valore impostato a tipologia prodotto scelta
    }

    getInfostampa()
    {
        console.log('Prodotto: ',nome)
        console.log(this.descrizione);
        console.log('costo unitario = ',this.costo,' euro.')
        console.log(tag);
    }


}


module.exports = Prodotto;

