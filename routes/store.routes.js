const { Router } = require('express');
const router = Router();
// Product model
const Product = require('../models/Product');

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

module.exports = router;