const {Schema, model} = require('mongoose');

const schema = new Schema({
    // a link to a user id in MongoDb from the collection User who will place the order // binding of orders to the user
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    cart: {
        type: Object, required: true
    },
    post_address: {
        type: String, required: true
    },
    first_name: {
        type: String, required: true
    },
    last_name: {
        type: String, required: true
    },
    phone_number: {
        type: String, required: true
    },
    city: {
        type: String, required: true
    }
});

module.exports = model('PostOrder', schema); // 'PostOrder' name of MongoDB collection and exports PostOrder schema