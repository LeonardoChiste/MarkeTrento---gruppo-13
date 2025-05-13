var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('DBPromotion', new Schema({ 
    data:Date,
    titolo:String,
    promotore:String,
    descrizione:String,
    img: {data: Buffer, type: String },
    tipoAnnuncio:String,
}));