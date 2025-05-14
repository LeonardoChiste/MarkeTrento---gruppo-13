var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('DBVendor', new Schema({ 
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String,
    sede:String,
    descrizione:String,
    tipo:String,
    datiPagamento:String,
}));