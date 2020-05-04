const { Router } = require('express');
const router = Router();
const Cart = require('../models/Cart');

// get checkout page // /store/checkout
router.get('/', async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart);
        res.render('checkout/CheckoutPage', { total: cart.totalPrice });
    } catch (e) {

    }
});

// get payment page // /store/checkout/payment
router.get('/payment', async (req, res) => {
     try {
         const cart = await new Cart(req.session.cart);
         res.render('checkout/PaymentPage', { total: cart.totalPrice });
     } catch (e) {

     }
});

module.exports = router;