var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define the Product schema
var ProductSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'Productv2' },
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
    carrello: { type: [ProductSchema], default: [] } // Array di prodotti, default vuoto (sennò causa problemi)
}));
