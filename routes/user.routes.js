const { Router } = require('express');
const router = Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const UserProduct = require('../models/UserProduct');

// get profile page // /store/user/profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const successMsg = req.flash('success')[0];
        const errMsg = req.flash('error')[0];

        const user = await User.find({ _id: req.user })
        const userProducts = await UserProduct.find({ user: req.user });
        await Order.find({ user: req.user }, (err, orders) => {
            if (err) {
                return req.flash('error', { message: err });
            }

            orders.forEach((order) => {
                const viewCart = new Cart(order.cart);
                order.items = viewCart.generateArray();
            });

            res.render('user/Profile', { orders: orders, userProducts: userProducts, user: user, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg });
        });

    } catch (e) {
        console.log({ message: e });
    }
});

//
router.get('/edit', isLoggedIn, async (req, res) => {
    try {
        const user = await User.find({ _id: req.user });
        res.render('user/EditPage', { title: 'Edit Page', user: user });
    } catch (e) {
        console.log({ message: e });
    }
});

//
router.post('/add-user-info/:id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id;
        const newUserInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        };

        await User.findByIdAndUpdate(userId, newUserInfo, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при додаванні інформації, спробуйте ще раз');
            }
            req.flash('success', 'Ви успішно додали вашу інформацію');
            res.redirect('/store/user/profile');
        });

    } catch (e) {
        console.log({ message: e });
    }
});

//
router.post('/edit-user-info/:id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hashSync(password, 5);
        const updatedUserInfo = {
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        };

        await User.findByIdAndUpdate(userId, updatedUserInfo, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при оновленні інформації, спробуйте ще раз');
            }
            req.flash('success', 'Ви успішно оновили вашу інформацію');
            res.redirect('/store/user/profile');
        });
    } catch (e) {
        console.log({ message: e });
    }
});

// the route add-user-product post method adds the user's product to the store // /store/user/add-user-product
router.post('/add-user-product', isLoggedIn, async (req, res) => {
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
        console.log({ message: e });
    }
});

//the route remove-user-product get method which delete user's product from the store // /store/user/remove-user-product
router.get('/remove-user-product/:id', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id;
        await UserProduct.findByIdAndRemove(productId, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при видаленні товару, спробуйте ще раз');
            }
            req.flash('success', 'Ви успішно видалили товар');
            res.redirect('/store/user/profile');
        });
    } catch (e) {
        console.log({ message: e });
    }
});

// the route update-user-product post method update the user's product in the store // /store/user/update-user-product
router.post('/update-user-product/:id', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedUserProduct = {
            imagePath: req.body.imagePath,
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description
        };

        await UserProduct.findByIdAndUpdate(productId, updatedUserProduct, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при редагуванню товару, спробуйте ще раз');
            }
            req.flash('success', 'Ви успішно редагували товар');
            res.redirect('/store/user/profile');
        });
    } catch (e) {
        console.log({ message: e });
    }
});

// route get method for logout from system
router.get('/logout', isLoggedIn, async (req, res) => {
   try {
       await req.logout();
       res.redirect('/store/home');
   } catch (e) {
       console.log({ message: e });
   }
});

module.exports = router;

// function for check if user login in the system
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/store/home');
}