const {Schema, model} = require('mongoose');

const schema = new Schema({
    // a link to a user id in MongoDb from the collection User who will place the order // binding of orders to the user
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    cart: {
        type: Object, required: true
    },
    address: {
        type: String, required: true
    },
    name: {
        type: String, required: true
    },
    lastname: {
        type: String, required: true
    },
    phonenum: {
        type: String, required: true
    },
    city: {
        type: String, required: true
    },
    paymentId: {
        type: String, required: true
    }
});

module.exports = model('Order', schema); // 'Order' name of MongoDB collection and exports Order schema