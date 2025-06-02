var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const consegnaSchema = new Schema({
    ordini: [{
        id: String,
        prezzo: Number
    }],
});

module.exports = mongoose.model('Consegna', consegnaSchema);