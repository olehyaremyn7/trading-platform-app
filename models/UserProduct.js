const {Schema, model} = require('mongoose');

const schema = new Schema({
    imagePath: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
});

module.exports = model('UserProduct', schema);