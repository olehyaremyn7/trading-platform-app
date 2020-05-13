const { Router } = require('express'); // express router for work with routes
const router = Router();
const Product = require('../models/Product'); // import Product schema
const UserProduct = require('../models/UserProduct'); // import User schema
const Cart = require('../models/Cart'); // import Cart schema

// get home page // /store/home
router.get('/home', async (req, res) => {
    try {
        const successMsg = req.flash('success')[0];
        await res.render('shop/HomePage', { title: 'Aligator Store | Home', successMsg: successMsg, noMessages: !successMsg });
    } catch (e) {
        console.log({ message: e });
    }
});

// get products from db and products page // /store/products
router.get('/products', async (req, res, next) => {
    try {
        const products = await Product.find({}).lean();
        await res.render('shop/ProductsPage', { title: 'Aligator Store | Products', products });
    } catch (e) {
        console.log({ message: e });
    }
});

// get user products page // /store/users-products
router.get('/users-products', async (req, res) => {
    try {
        const userProducts = await UserProduct.find({}).lean();
        await res.render('shop/UserProductsPage', { title: 'Aligator Store | Users Products', userProducts });
    } catch (e) {
        console.log({ message: e });
    }
});

// get product page // /store/product/id
router.get('/product/:id', async (req, res) => {
    try {
        const singleProduct = await Product.find({ _id: req.params.id }).lean();
        res.render('shop/ProductPage', { title: 'Aligator Store | Product', singleProduct });
    } catch (e) {
        console.log({ message: e });
    }
});

// get about-us page // /store/about-us
router.get('/about-us', async (req, res) => {
    try {
        await res.render('shop/AboutUsPage', { title: 'Aligator Store | About Us' });
    } catch (e) {
        console.log({ message: e });
    }
});

// get blog page // /store/blog
router.get('/contact', async (req, res) => {
    try {
        await res.render('shop/ContactPage', { title: 'Aligator Store | Contact' });
    } catch (e) {
        console.log({ message: e });
    }
});

// get route for add product to shopping cart by id // /store/add-to-cart
router.get('/add-to-cart/:id', async (req, res) => {
     try {
         const productId = req.params.id;
         const cart = new Cart(req.session.cart ? req.session.cart : {});

         await Product.findById(productId, (err, product) => {
             if (err) {
                 return res.redirect('/store/home');
             }

             cart.addToCart(product, product.id);
             req.session.cart = cart;
             console.log(req.session.cart);
             res.redirect('/store/home');
         });
     } catch (e) {
        console.log({ message: e });
     }
});

// get reduce method which reduce one item from cart by id // /store/reduce
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

// get remove method which remove all items from cart by id // /store/remove
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
            return res.render('shop/ShoppingCartPage', { title: 'Aligator Store | Cart', products: null });
        }

        const cart = await new Cart(req.session.cart);
        res.render('shop/ShoppingCartPage', { title: 'Aligator Store | Cart', products: cart.generateArray(), totalPrice: cart.totalPrice });
    } catch (e) {
        console.log({ message: e });
    }
});

// get search page where we can see search results // /store/search
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
            }).lean();
            const filteredUserProducts = await UserProduct.find({ title: regex }, (err, res) => {
                if (err) {
                    console.log(err);
                    res.redirect('/store/search');
                    return req.flash('error', 'Сталася помилка при пошуку, спробуйте ще раз');
                }
            }).lean();

            res.render('shop/SearchPage', { title: 'Aligator Store | Products', filteredProducts, filteredUserProducts, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg })
        }
    } catch (e) {
        console.log({ message: e });
    }
});

module.exports = router;

// function for valid search data
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}