var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const OrderSchema = new Schema({
    prodotti: [
        {
            _id: { type: Schema.Types.ObjectId, ref: 'Productv2' },
            nome: String,
            prezzo: Number,
            quantity: Number
        }
    ],
    venditore: { type: Schema.Types.ObjectId, ref: 'Venditore' },
    cliente: { type: Schema.Types.ObjectId, ref: 'Client' },
    zona: String,
    tipo: String,
    pubblicazione: { type: Date, default: Date.now },
    stato: { type: String, default: 'In elaborazione' }
});

module.exports = mongoose.model('Order', OrderSchema);