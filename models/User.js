const { Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: false,
        default: 'user first name'
    },
    lastName: {
        type: String,
        required: false,
        default: 'user last name'
    },
    phone: {
        type: String,
        required: false,
        default: 'user phone number'
    }
})

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = model('User', userSchema)
