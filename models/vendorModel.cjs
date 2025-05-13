var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Vendor', new Schema({ 
    id:Number,
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String,
    prodotti:[{type: Schema.Types.ObjectId, ref: 'Product'}],
    tipoAzienda:String,
}));