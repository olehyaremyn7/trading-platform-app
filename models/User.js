const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{
        type: Types.ObjectId, ref: 'UserProduct'
    }]
});

module.exports = model('User', userSchema);