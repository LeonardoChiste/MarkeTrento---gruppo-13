var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Product', new Schema({ 
    id:Number,
    prodotto:{type: Schema.Types.ObjectId, ref: 'Product'},
    venditore:{type: Schema.Types.ObjectId, ref: 'Vendor'},
    cliente:{type: Schema.Types.ObjectId, ref: 'Client'},
    pubblicazione:Date,
}));