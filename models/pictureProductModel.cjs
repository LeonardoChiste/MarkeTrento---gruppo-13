var mongoose= require('mongoose');
var Schema = mongoose.Schema;

const ImageSchema = new Schema({
    data: Buffer,
    contentType: String // use contentType instead of type to avoid conflict
}, { _id: false });

module.exports =  mongoose.model('DBPictureProduct', new Schema({
    prodottoId:{type: String, required: true},
    img: ImageSchema,
}));


