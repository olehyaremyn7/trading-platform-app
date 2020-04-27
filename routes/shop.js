const { Router } = require('express');
const router = Router();
const csrf = require('csurf');
const passport = require('passport');

const Product = require('../models/Product');
// csrf protection middleware
const csrfProtection = csrf();
router.use(csrfProtection);

// get home page // /shop/home
router.get('/home', async (req, res) => {
    res.render('shop/HomePage', { title: 'Shop home page' })
});

// get products from db // /shop/products
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.render('shop/ProductsPage', { title: 'Products Page', products })
    } catch (e) {
        res.status(500).json({ message: 'Сталася помилка, спробуйте знову' })
    }
});

router.get('/user/signup', (req, res) => {
    const messages = req.flash('error');
    res.render('user/SignUp', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
});

router.post('/user/signup', passport.authenticate('local.signup', {
   successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', (req, res) => {
    res.render('user/Profile');
});

// get user products page // /shop/user-products

module.exports = router;