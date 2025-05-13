var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Client', new Schema({ 
	id:Number,
    nome:String,
    cognome:String,
    birthdate:Date,
    email:String,
    username:String,
    password:String
}));
