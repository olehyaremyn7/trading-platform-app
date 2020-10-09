const {Router} = require('express')
const router = Router()
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const PostOrder = require('../models/PostOrder')
const config = require('../config/keys.dev.config')

router.get('/', async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart)
        res.render('checkout/CheckoutPage', { title: 'Aligator Store | Checkout', total: cart.totalPrice })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/', isLoggedIn, async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart)
        const postOrder = new PostOrder({
            user: req.user,
            cart: cart,
            post_address: req.body.post_address,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            city: req.body.city
        })

        await postOrder.save((err) => {
            if (err) {
                return res.send({ message: err })
            }
            req.flash('success', 'Ви оформили замовлення товару')
            req.session.cart = null
            res.redirect('/store/home')
        })
    } catch (e) {
        console.log({ message: e })
    }
})

router.get('/payment', isLoggedIn, async (req, res) => {
     try {
         const errMsg = req.flash('error')[0]
         const cart = await new Cart(req.session.cart)
         res.render('checkout/PaymentPage', { title: 'Aligator Store | Payment', total: cart.totalPrice, errMsg: errMsg, noError: !errMsg })
     } catch (e) {
         console.log({ message: e })
     }
})

router.post('/payment', isLoggedIn, async (req, res) => {
    try {
        if (!req.session.cart) {
            return res.redirect('/store/shopping-cart')
        }

        const cart = await new Cart(req.session.cart)
        const stripe = require('stripe')(config.stripeSecretKey)

        stripe.charges.create(
            {
                amount: cart.totalPrice * 100,
                currency: 'usd',
                source: "tok_mastercard",
                description: 'Test Charge',
            }, function (err, charge) {

                if (err) {
                    req.flash('error', err.message)
                    return res.redirect('/store/checkout/payment')
                }

                const order = new Order({
                    user: req.user,
                    cart: cart,
                    address: req.body.address,
                    name: req.body.name,
                    lastname: req.body.lastname,
                    phonenum: req.body.phonenum,
                    city: req.body.city,
                    paymentId: charge.id
                })

                order.save((err, result) => {
                    if (err) {
                        return res.send({ message: err })
                    }
                    req.flash('success', 'Ви успішно здійснили покупку товару')
                    req.session.cart = null
                    res.redirect('/store/home')
                })
            })
    } catch (e) {
        console.log({ message: e })
    }
})

module.exports = router

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    const url = '/store/checkout/payment'
    req.session.oldURL = url
    res.redirect('/store/authorization/signin')
}
