const { Router } = require('express');
const router = Router();
const passport = require('passport');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const UserProduct = require('../models/UserProduct');

// get profile page // /store/user/profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];
        await Order.find({ user: req.user }, (err, orders) => {
            if (err) {
                return res.write({ message: err });
            }

            orders.forEach((order) => {
                const viewCart = new Cart(order.cart);
                order.items = viewCart.generateArray();
            });

            res.render('user/Profile', { orders: orders, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg });
        });
    } catch (e) {
        console.log({ message: e });
    }
});

// the route add-user-product post method adds the user's product to the store // /store/user/add-user-product
router.post('/add-user-product', async (req, res) => {
    try {
        const userProduct = new UserProduct({
            imagePath: req.body.imagePath,
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            user: req.user
        })

        await userProduct.save((err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при додаванні товару, спробуйте ще раз');
            }
            req.flash('success', 'Ви успішно додали товар');
            res.redirect('/store/user/profile');
        });
    } catch (e) {

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