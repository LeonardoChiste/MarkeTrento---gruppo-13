var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Product', new Schema({ 
    data:Date,
    titolo:String,
    promotore:{type: Schema.Types.ObjectId, ref: 'Promoter'},
    descrizione:String,
    img: {data: Buffer, type: String },
    tipoAnnuncio:String,
}));