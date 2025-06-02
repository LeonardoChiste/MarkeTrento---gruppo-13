var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const fileSchema = new Schema({
    data: Buffer,
    contentType: String,
    fileName: String // Optional: store original filename
}, { _id: false });

// set up a mongoose model
module.exports = mongoose.model('DBFormVend', new Schema({ 
    imprenditore: { 
        type: Schema.Types.ObjectId, ref: 'DBEntrepreneur',
        required: true
    },
    pdf: fileSchema,
    uploadDate: {
        type: Date,
        default: Date.now
    }
}));