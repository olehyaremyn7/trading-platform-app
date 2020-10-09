const { Router } = require('express')
const router = Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const UserProduct = require('../models/UserProduct')
const Contact = require('../models/Contact')

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const successMsg = req.flash('success')[0]
        const errMsg = req.flash('error')[0]

        const user = await User.find({ _id: req.user }).lean()
        const userProducts = await UserProduct.find({ user: req.user }).lean()

        await Order.find({ user: req.user }, (err, orders) => {
            if (err) {
                return req.flash('error', { message: err })
            }

            orders.forEach((order) => {
                const viewCart = new Cart(order.cart)
                order.items = viewCart.generateArray()
            })

            res.render('user/ProfilePage', { title: 'Aligator Store | Profile', orders: orders, userProducts, user, errMsg: errMsg, noError: !errMsg, successMsg: successMsg, noMessages: !successMsg })
        })

    } catch (e) {
        console.log({ message: e })
    }
})

router.get('/edit', isLoggedIn, async (req, res) => {
    try {
        const user = await User.find({ _id: req.user }).lean()
        res.render('user/EditPage', { title: 'Aligator Store | Edit', user })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/add-user-info/:id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id;
        const newUserInfo = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        }

        await User.findByIdAndUpdate(userId, newUserInfo, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при додаванні інформації, спробуйте ще раз')
            }
            req.flash('success', 'Ви успішно додали вашу інформацію')
            res.redirect('/store/user/profile')
        })

    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/edit-user-info/:id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.params.id
        const password = req.body.password
        const hashedPassword = await bcrypt.hashSync(password, 5)
        const updatedUserInfo = {
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone
        }

        await User.findByIdAndUpdate(userId, updatedUserInfo, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при оновленні інформації, спробуйте ще раз')
            }
            req.flash('success', 'Ви успішно оновили вашу інформацію')
            res.redirect('/store/user/profile')
        })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/add-user-product', isLoggedIn, async (req, res) => {
    try {
        const userProduct = new UserProduct({
            imagePath: req.body.imagePath,
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            state: req.body.state,
            description: req.body.description,
            user: req.user
        })

        await userProduct.save((err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при додаванні товару, спробуйте ще раз')
            }
            req.flash('success', 'Ви успішно додали товар')
            res.redirect('/store/user/profile')
        })
    } catch (e) {
        console.log({ message: e })
    }
})

router.get('/remove-user-product/:id', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id
        await UserProduct.findByIdAndRemove(productId, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при видаленні товару, спробуйте ще раз')
            }
            req.flash('success', 'Ви успішно видалили товар')
            res.redirect('/store/user/profile')
        })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/update-user-product/:id', isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id
        const updatedUserProduct = {
            imagePath: req.body.imagePath,
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            state: req.body.state
        }

        await UserProduct.findByIdAndUpdate(productId, updatedUserProduct, (err) => {
            if (err) {
                return req.flash('error', 'Сталася помилка при редагуванню товару, спробуйте ще раз')
            }
            req.flash('success', 'Ви успішно редагували товар')
            res.redirect('/store/user/profile')
        })
    } catch (e) {
        console.log({ message: e })
    }
})

router.get('/logout', isLoggedIn, async (req, res) => {
   try {
       await req.logout()
       res.redirect('/store/home')
   } catch (e) {
       console.log({ message: e })
   }
})

module.exports = router

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/store/home')
}
