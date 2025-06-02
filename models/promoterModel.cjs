var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Productv2' },
    nome: String,
    prezzo: Number,
    quantity: Number
});

// set up a mongoose model
module.exports = mongoose.model('DBEntrepreneur', new Schema({ 
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String,
    sede:String,
    descrizione:String,
    tipo:String,
    carrello: { type: [ProductSchema], default: [] }, 
}));