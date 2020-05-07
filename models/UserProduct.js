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
    // a link to a user id in MongoDb from the collection User who will add the item // binding of goods to the user
    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
});

module.exports = model('UserProduct', schema); // 'UserProduct' name of MongoDB collection and exports UserProduct schema