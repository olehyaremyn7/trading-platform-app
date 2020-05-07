const { Schema, model} = require('mongoose');
const bcrypt = require('bcrypt'); // password encryption library

// User MongoDB Schema
const userSchema = new Schema({
    // username = email
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
});

// bcrypt hash password
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

// bcrypt compare passwords when user login
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = model('User', userSchema); // // 'UserProduct' name of MongoDB collection and exports User schema