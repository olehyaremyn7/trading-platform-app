const { Router } = require('express');
const router = Router();
// Product model
const Product = require('../models/Product');
const Cart = require('../models/Cart');

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

// get user products page // /shop/user-products

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

module.exports = router;