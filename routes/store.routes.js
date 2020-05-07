const { Router } = require('express');
const router = Router();
// Product model
const Product = require('../models/Product');
const UserProduct = require('../models/UserProduct');
const Cart = require('../models/Cart');

// get home page // /store/home
router.get('/home', async (req, res) => {
    const successMsg = req.flash('success')[0];
    res.render('shop/HomePage', { title: 'Shop home page', successMsg: successMsg, noMessages: !successMsg })
});

// get products from db and products page // /store/products
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.render('shop/ProductsPage', { title: 'Products Page', products })
    } catch (e) {
        res.status(500).json({ message: 'Сталася помилка, спробуйте знову' })
    }
});

// get user products page // /store/users-products
router.get('/users-products', async (req, res) => {
    try {
        const userProducts = await UserProduct.find({});
        res.render('shop/UserProductsPage', { title: 'Users Products Page', userProducts })
    } catch (e) {

    }
});

// get route for add product to shopping cart // /store/add-to-cart
router.get('/add-to-cart/:id', async (req, res) => {
     try {
         const productId = req.params.id;
         const cart = new Cart(req.session.cart ? req.session.cart : {});

         await Product.findById(productId, (err, product) => {
             if (err) {
                 return res.redirect('/store/home');
             }

             cart.addToCart(product, product.id)
             req.session.cart = cart;
             console.log(req.session.cart);
             res.redirect('/store/home');
         });
     } catch (e) {
        console.log({ message: e });
     }
});

// get reduce method which reduce one item from cart
router.get('/reduce/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        await cart.reduceByOne(productId);
        req.session.cart = cart;
        res.redirect('/store/shopping-cart');
    } catch (e) {
        console.log({ message: e });
    }
});

// get remove method which remove all items from cart
router.get('/remove/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        await cart.removeItem(productId);
        req.session.cart = cart;
        res.redirect('/store/shopping-cart');
    } catch (e) {
        console.log({ message: e });
    }
});

// get shopping-cart page // /store/shopping-cart
router.get('/shopping-cart', async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.render('shop/ShoppingCart', { products: null });
        }

        const cart = await new Cart(req.session.cart);
        res.render('shop/ShoppingCart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
    } catch (e) {
        console.log({ message: e });
    }

});

//
router.get('/search', async (req, res) => {
    try {
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];

        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            const filteredProducts = await Product.find({ title: regex }, (err, res) => {
                if (err) {
                    console.log(err);
                    res.redirect('/store/search');
                    return req.flash('error', 'Сталася помилка при пошуку, спробуйте ще раз');
                }
            });
            const filteredUserProducts = await UserProduct.find({ title: regex }, (err, res) => {
                if (err) {
                    console.log(err);
                    res.redirect('/store/search');
                    return req.flash('error', 'Сталася помилка при пошуку, спробуйте ще раз');
                }
            });

            res.render('shop/SearchPage', { title: 'Search Page', filteredProducts: filteredProducts, filteredUserProducts: filteredUserProducts, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg })
        }
    } catch (e) {
        console.log({ message: e });
    }
});

module.exports = router;

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}