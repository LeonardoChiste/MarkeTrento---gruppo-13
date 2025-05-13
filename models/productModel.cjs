var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Productv2', new Schema({ 
    id:Number,
    titolo:String,
    descrizione:String,
    venditore:String,
    prezzo:Number,
    quantita:Number,
    tipoProdotto:String,
}));