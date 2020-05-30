const { Router } = require('express'); // express router for work with routes
const router = Router();
const Product = require('../models/Product'); // import Product schema
const UserProduct = require('../models/UserProduct'); // import User schema
const Cart = require('../models/Cart'); // import Cart schema
const Wish = require('../models/Wish');
const User = require('../models/User');
const _ = require('lodash');
const Contact = require('../models/Contact');
const Subscribe = require('../models/Subscribe');

// get home page // /store/home
router.get('/home', async (req, res) => {
    try {
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];
        await res.render('shop/HomePage', { title: 'Aligator Store | Home', errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg });
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
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];

        const avarageRating = await Product.find({ _id: req.params.id }).lean();
        const getAvarager = () => {
            for (let keys in avarageRating) {
                let rating = avarageRating[keys]
                return rating.rating
            }
        }
        const avarage = _(getAvarager()).mean(function (r) {
            return r
        })

        const singleProduct = await Product.find({ _id: req.params.id }).lean();
        res.render('shop/ProductPage', { title: 'Aligator Store | Product', avarage ,singleProduct, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg });
    } catch (e) {
        console.log({ message: e });
    }
});

router.post('/product-rating/:id', async (req, res) => {
    try {
        const productID = req.params.id;
        const query = req.body.rating_select;
        const productRating = {
            $push: {
                "rating": query
            }
        };

        await Product.findByIdAndUpdate(productID, productRating,(err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при оцінюванні, спробуйте ще раз');
            }
            req.flash('success', 'Товар оцінено');
            res.redirect(req.get('referer'));
        });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/user-product/:id', async (req, res) => {
    try {
        const singleUserProduct = await UserProduct.find({ _id: req.params.id }).lean();
        const getUserId = () => {
            for (let keys in singleUserProduct) {
                let user = singleUserProduct[keys]
                return user.user
            }
        }
        const userID = getUserId();
        const userProductInfo = await User.find({ _id: userID }).lean();
        res.render('shop/UserProductPage', { title: 'Aligator Store | User Product', userProductInfo, singleUserProduct });
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
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];
        await res.render('shop/ContactPage', { title: 'Aligator Store | Contact', errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg });
    } catch (e) {
        console.log({ message: e });
    }
});

router.post('/contact', async (req, res) => {
    try {
        const userMessage = new Contact({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        await userMessage.save((err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при відправленні, спробуйте ще раз');
            }
            req.flash('success', 'Дякуємо за ваше повідомлення, ми постараємся дати Вам відповідь у найближчий час');
            res.redirect('/store/contact');
        });
    } catch (e) {
        console.log({ message: e });
    }
});

router.post('/subscribe', async (req, res) => {
    try {
        const subNews = new Subscribe({
            email: req.body.email
        });

        await subNews.save((err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при відправленні запросу на підписку, спробуйте ще раз');
            }
            req.flash('success', 'Дякуємо за вашу підписку');
            res.redirect('/store/home');
        });
    } catch (e) {

    }
});

router.get('/add-to-wish/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const wish = new Wish(req.session.wish ? req.session.wish : {});

        await Product.findById(id, (err, product) => {
            if (err) {
                return res.redirect('/store/home');
            }

            wish.addToWish(product, product.id);
            req.session.wish = wish;
            console.log(req.session.wish);
            res.redirect(req.get('referer'));
        });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/wish', async (req, res) => {
    try {
        if (!req.session.wish) {
            return res.render('shop/WishPage', { title: 'Aligator Store | Wish', products: null });
        }

        const wish = await new Wish(req.session.wish);
        res.render('shop/WishPage', { title: 'Aligator Store | Wish', products: wish.generateArray(), totalPrice: wish.totalPrice });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/remove-wish/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const wish = new Wish(req.session.wish ? req.session.wish : {});

        await wish.removeItem(id);
        req.session.wish = wish;
        res.redirect('/store/wish');
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
             res.redirect(req.get('referer'));
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

            res.render('shop/SearchPage', { title: 'Aligator Store | Search', filteredProducts, filteredUserProducts, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg })
        }
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/products-category', async (req, res) => {
    try {
        const query = req.query.category_select;
        const productCategory = await Product.find({ category: query }).lean();
        res.render('shop/CategoryPage', { title: 'Aligator Store | Results', productCategory });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/products-sort', async (req, res) => {
    try {
        const query = req.query.sort;

        if ( query === 'sort_from_cheaper' ) {
            const sort_by_cheaper = await Product.find({}).lean();
            const output = _(sort_by_cheaper)
                .filter(function (o) {
                    return o.price > 10
                })
                .sortBy(function (o) {
                    return o.price
                })
                .value()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_from_expensive' ) {
            const sort_from_expensive = await Product.find({}).lean();
            const output = _(sort_from_expensive)
                .filter(function (o) {
                    return o.price < 20000
                })
                .orderBy(['price'], ['desc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_a_z' ) {
            const sort_from_expensive = await Product.find({}).lean();
            const output = _(sort_from_expensive)
                .orderBy(['title'], ['asc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_z_a' ) {
            const sort_from_expensive = await Product.find({}).lean();
            const output = _(sort_from_expensive)
                .orderBy(['title'], ['desc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/products-state', async (req, res) => {
    try {
        const query = req.query.state_product;

        if ( query === 'New' ) {
            const productState = await Product.find({ state: query }).lean();
            res.render('shop/StateSortPage', { title: 'Aligator Store | Results', productState });
        }

        if ( query === 'Used' ) {
            const productState = await Product.find({ state: query }).lean();
            res.render('shop/StateSortPage', { title: 'Aligator Store | Results', productState });
        }
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/products-price-range', async (req, res) => {
    try {
        const price_from = req.query.price_from;
        const price_to = req.query.price_to;
        const products = await Product.find({}).lean();
        const output = _(products)
            .filter(function (x) {
                return x.price >= price_from && x.price <= price_to
            })
            .sortBy(function (o) {
                return o.price
            })
            .value()

        res.render('shop/PriceSortPage', { title: 'Aligator Store | Results', output });
    } catch (e) {
        console.log({ message: e });
    }
});

// user category, sort, state, price range
router.get('/user-products-category', async (req, res) => {
    try {
        const query = req.query.category_select;
        const productCategory = await UserProduct.find({ category: query }).lean();
        res.render('shop/CategoryPage', { title: 'Aligator Store | Results', productCategory });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/user-products-sort', async (req, res) => {
    try {
        const query = req.query.sort;

        if ( query === 'sort_from_cheaper' ) {
            const sort_by_cheaper = await UserProduct.find({}).lean();
            const output = _(sort_by_cheaper)
                .filter(function (o) {
                    return o.price > 10
                })
                .sortBy(function (o) {
                    return o.price
                })
                .value()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_from_expensive' ) {
            const sort_from_expensive = await UserProduct.find({}).lean();
            const output = _(sort_from_expensive)
                .filter(function (o) {
                    return o.price < 20000
                })
                .orderBy(['price'], ['desc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_a_z' ) {
            const sort_from_expensive = await UserProduct.find({}).lean();
            const output = _(sort_from_expensive)
                .orderBy(['title'], ['asc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }

        if ( query === 'sort_z_a' ) {
            const sort_from_expensive = await UserProduct.find({}).lean();
            const output = _(sort_from_expensive)
                .orderBy(['title'], ['desc'])
                .values()

            res.render('shop/SortPage', { title: 'Aligator Store | Results', output });
        }
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/user-products-state', async (req, res) => {
    try {
        const query = req.query.state_product;

        if ( query === 'New' ) {
            const productState = await UserProduct.find({ state: query }).lean();
            res.render('shop/StateSortPage', { title: 'Aligator Store | Results', productState });
        }

        if ( query === 'Used' ) {
            const productState = await UserProduct.find({ state: query }).lean();
            res.render('shop/StateSortPage', { title: 'Aligator Store | Results', productState });
        }
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/user-products-price-range', async (req, res) => {
    try {
        const price_from = req.query.price_from;
        const price_to = req.query.price_to;
        const products = await UserProduct.find({}).lean();
        const output = _(products)
            .filter(function (x) {
                return x.price >= price_from && x.price <= price_to
            })
            .sortBy(function (o) {
                return o.price
            })
            .value()

        res.render('shop/PriceSortPage', { title: 'Aligator Store | Results', output });
    } catch (e) {
        console.log({ message: e });
    }
});

module.exports = router;

// function for valid search data
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}