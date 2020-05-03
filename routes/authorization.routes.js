const { Router } = require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');

// csrf protection middleware
const csrfProtection = csrf();
router.use(csrfProtection);

router.use('/store/authorization', notLoggedIn, (req, res, next) => {
   next();
});

// get csrfToken route when we render SignUp page /store/authorization/signup
router.get('/signup', (req, res) => {
    const messages = req.flash('error');
    res.render('user/SignUp', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

// signup post method and passport middleware for registration
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/store/user/profile',
    failureRedirect: '/store/authorization/signup',
    failureFlash: true
}));

// get csrfToken route when we render SignIn page /store/authorization/signin
router.get('/signin', (req, res) => {
    const messages = req.flash('error');
    res.render('user/SignIn', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

// signup post method and passport middleware for login
router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/store/user/profile',
    failureRedirect: '/store/authorization/signin',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/store/home');
});

module.exports = router;

function notLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/store/home');
}