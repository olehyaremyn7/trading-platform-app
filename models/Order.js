const {Schema, model} = require('mongoose')

const schema = new Schema({
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
})

module.exports = model('Order', schema)
