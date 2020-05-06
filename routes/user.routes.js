const { Router } = require('express');
const router = Router();
const passport = require('passport');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// get profile page // /store/user/profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        await Order.find({ user: req.user }, (err, orders) => {
            if (err) {
                return res.write({ message: err });
            }

            orders.forEach((order) => {
                const viewCart = new Cart(order.cart);
                order.items = viewCart.generateArray();
            });

            res.render('user/Profile', { orders: orders });
        });
    } catch (e) {
        console.log({ message: e });
    }
});

router.get('/logout', isLoggedIn, async (req, res) => {
   try {
       await req.logout();
       res.redirect('/store/home');
   } catch (e) {
       console.log({ message: e });
   }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/store/home');
}