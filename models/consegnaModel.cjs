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
    status: String
});

module.exports = mongoose.model('Consegna', consegnaSchema);