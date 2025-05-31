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
    venditore: { type: Schema.Types.ObjectId, ref: 'DBVendor' },
    cliente: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'clienteModel'
    },
    clienteModel: {
        type: String,
        required: true,
        enum: ['DBClient', 'DBVendor', 'DBEntrepreneur']
    },
    zona: String,
    tipo: String,
    pubblicazione: { type: Date, default: Date.now },
    stato: { type: String, default: 'In elaborazione' }
});

module.exports = mongoose.model('Order', OrderSchema);