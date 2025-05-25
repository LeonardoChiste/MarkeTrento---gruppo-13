var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ImageSchema = new Schema({
    data: Buffer,
    contentType: String // use contentType instead of type to avoid conflict
}, { _id: false });

// set up a mongoose model
module.exports = mongoose.model('DBPromotion', new Schema({ 
    data:Date,
    titolo:String,
    promotore:String,
    descrizione:String,
    img: ImageSchema,
    tipoAnnuncio:String,
}));