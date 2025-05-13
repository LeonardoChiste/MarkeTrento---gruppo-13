var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Product', new Schema({ 
    id:Number,
    nome:String,
    pubblicazione:Date,
    venditore:{type: Schema.Types.ObjectId, ref: 'Client'}
}));