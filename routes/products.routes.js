const { Router } = require('express');
const router = Router();
const Product = require('../models/Product');

// get products from db // /shop/products
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.status(200).render('shop/ProductsPage', { title: 'Products Page', products })
    } catch (e) {
        res.status(500).json({ message: 'Сталася помилка, спробуйте знову' })
    }
});

// get user products page // /shop/user-products

module.exports = router;