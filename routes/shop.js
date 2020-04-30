const { Router } = require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');

const Product = require('../models/Product');
// csrf protection middleware
const csrfProtection = csrf();
router.use(csrfProtection);

// get home page // /store/home
router.get('/home', async (req, res) => {
    res.render('shop/HomePage', { title: 'Shop home page' })
});

// get products from db and products page // /store/products
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.render('shop/ProductsPage', { title: 'Products Page', products })
    } catch (e) {
        res.status(500).json({ message: 'Сталася помилка, спробуйте знову' })
    }
});

// get csrfToken route when we render SignUp page /store/authorization/signup
router.get('/user/signup', (req, res) => {
    const messages = req.flash('error');
    res.render('user/SignUp', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

// signup post method and passport middleware for registration
router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

// get profile page // /store/user/profile
router.get('/user/profile', (req, res) => {
    res.render('user/Profile');
});

// get csrfToken route when we render SignIn page /store/authorization/signin
router.get('/user/signin', (req, res) => {
    const messages = req.flash('error');
    res.render('user/SignIn', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

// signup post method and passport middleware for login
router.post('/user/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

// get user products page // /shop/user-products

module.exports = router;