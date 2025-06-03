var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const consegnaSchema = new Schema({
    ordini: [{
        id: String,
    }],
    data: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Consegna', consegnaSchema);