var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Productv2', new Schema({ 
    nome:String,
    descrizione:String,
    venditore:String,
    quantita:Number,
    costo:Number,
    tag:String, //tag come enum ossia array di valore impostato a tipologia prodotto scelta
    immagine:String
}));