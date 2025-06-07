var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('DBRecensione', new Schema({ 

    titolo:String,
    testo:String,
    stelle: { type: Number, min: 1, max: 5, required: true },
    data: { type: Date, default: Date.now },
    ordine: { type: Schema.Types.ObjectId, ref: 'Order' }
}));
