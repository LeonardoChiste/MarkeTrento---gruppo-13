var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define the Product schema
var ProductSchema = new Schema({
    nome: String,
    prezzo: Number,
    quantity: Number
});

// set up a mongoose model
module.exports = mongoose.model('DBClient', new Schema({ 
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String,
    carrello: [ProductSchema] //Array di prodotti
}));
