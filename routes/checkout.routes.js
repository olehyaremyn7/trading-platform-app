const { Router } = require('express');
const router = Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order')

// get checkout page // /store/checkout
router.get('/', async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart);
        res.render('checkout/CheckoutPage', { total: cart.totalPrice });
    } catch (e) {
        console.log({ message: e });
    }
});

// get payment page // /store/checkout/payment
router.get('/payment', isLoggedIn, async (req, res) => {
     try {
         const cart = await new Cart(req.session.cart);
         const errMsg = req.flash('error')[0];
         res.render('checkout/PaymentPage', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
     } catch (e) {
         console.log({ message: e });
     }
});

// payment post method for order // /store/checkout/payment
router.post('/payment', isLoggedIn, async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart);
        const stripe = require('stripe')('sk_test_TETZnvYbxCYvbL1smd6xU5KX001uV3HAX9');
        // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
        stripe.charges.create(
            {
                amount: cart.totalPrice * 100,
                currency: 'usd',
                source: "tok_mastercard", // obtained with Stripe.js
                description: 'Test Charge',
            }, function (err, charge) {

                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('/store/checkout/payment');
                }

                const order = new Order({
                    user: req.user,
                    cart: cart,
                    address: req.body.address,
                    name: req.body.name,
                    paymentId: charge.id
                });

                order.save((err, result) => {
                    if (err) {
                        return res.send({ message: err })
                    }
                    req.flash('success', 'Ви успішно здійснили покупку товару');
                    req.session.cart = null;
                    res.redirect('/store/home');
                });
            });
    } catch (e) {
        console.log({ message: e });
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    const url = '/store/checkout/payment';
    req.session.oldURL = url;
    res.redirect('/store/authorization/signin');
}