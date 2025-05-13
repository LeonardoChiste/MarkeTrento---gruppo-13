var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema per i prodotti 
var ProductSchema = new Schema({
    nome: String,
    prezzo: Number
});

// set up a mongoose model
module.exports = mongoose.model('Client', new Schema({ 
	id:Number,
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String,
    carrello: [ProductSchema] //Array di prodotti
}));
