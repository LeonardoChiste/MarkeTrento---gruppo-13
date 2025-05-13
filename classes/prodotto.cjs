const mongoose = require ('mongoose');

class Prodotto{
    constructor(nome, descrizione,prezzo,tag){
        this.nome=nome;
        this.descrizione=descrizione;
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
/*const pr=new mongoose.Schema(
{
     
            id:Number,
            nome:String,
            descrizione:String,
            costo:Number,
            tag:String,}
           
        
        );
        const Product =mongoose.model('Prodotto',pr);


module.exports = {Prodotto,Product};*/

