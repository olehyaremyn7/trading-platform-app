const { Router } = require('express'); // express router for work with routes
const router = Router();
const csrf = require('csurf'); // csrf protection library
const passport = require('passport'); // Passport is authentication middleware for Node.js.

// csrf protection middleware
const csrfProtection = csrf();
router.use(csrfProtection);

router.use('/store/authorization', notLoggedIn, async (req, res, next) => {
    try {
        await next();
    } catch (e) {
        console.log({ message: e });
    }
});

// get csrfToken route when we render SignUp page // /store/authorization/signup
router.get('/signup', async (req, res) => {
    try {
        const messages = req.flash('error');
        await res.render('user/RegistrationPage', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
    } catch (e) {
        console.log({ message: e });
    }
});

// signup post method and passport middleware for registration // /store/authorization/signup
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/store/authorization/signup',
    failureFlash: true
}), (req, res) => {
    if (req.session.oldURL) {
        const oldURL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldURL);
    } else {
        res.redirect('/store/user/profile');
    }
});

// get csrfToken route when we render SignIn page // /store/authorization/signin
router.get('/signin', async (req, res) => {
    try {
        const messages = req.flash('error');
        await res.render('user/LoginPage', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
    } catch (e) {
        console.log({ message: e });
    }
});

// signup post method and passport middleware for login // /store/authorization/signin
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/store/authorization/signin',
    failureFlash: true
}), (req, res) => {
    if (req.session.oldURL) {
        const oldURL = req.session.oldURL;
        req.session.oldURL = null;
        res.redirect(oldURL);
    } else {
        res.redirect('/store/user/profile');
    }
});

module.exports = router;

// function for check if user login in the system
function notLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/store/home');
}