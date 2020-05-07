const passport = require('passport'); // Passport is authentication middleware for Node.js.
const User = require('../models/User'); // import User schema
const LocalStrategy = require('passport-local').Strategy; // Passport strategy for authenticating with a username and password.

// Passport methods to set the compliance of user authentication req
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Passport registration strategy
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

    // express validation
    req.checkBody('username', 'Некоректна електронна пошта').notEmpty().isEmail();
    req.checkBody('password', 'Некоректний пароль').notEmpty().isLength({min:6});

    // error handler
    const errors = req.validationErrors();
    if (errors) {
        const messages = [];
        errors.forEach((error) => { messages.push(error.msg) });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'username': username}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (user) {
            return done(null, false, {message: 'Користувач з такою електронною поштою уже існує'});
        }

        const newUser = new User();
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password); // call the function to encrypt the password
        newUser.save((err, result) => {

            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

// Passport login strategy
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {

    // express validation
    req.checkBody('username', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();

    // error handler
    const errors = req.validationErrors();
    if (errors) {
        const messages = [];
        errors.forEach((error) => { messages.push(error.msg); });
        return done(null, false, req.flash('error', messages));
    }

    User.findOne({'username': username}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, {message: 'Користувач відсутній'});
        }

        // call the function to check the password
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Невірний пароль'});
        }
        return done(null, user);
    });
}));