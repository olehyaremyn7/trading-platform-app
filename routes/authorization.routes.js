const { Router } = require('express')
const router = Router()
const csrf = require('csurf')
const passport = require('passport')

const csrfProtection = csrf()
router.use(csrfProtection)

router.use('/store/authorization', notLoggedIn, async (req, res, next) => {
    try {
        await next()
    } catch (e) {
        console.log({ message: e })
    }
})

router.get('/signup', async (req, res) => {
    try {
        const messages = req.flash('error')
        await res.render('user/RegistrationPage', { title: 'Aligator Store | Registration', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/store/authorization/signup',
    failureFlash: true
}), (req, res) => {
    if (req.session.oldURL) {
        const oldURL = req.session.oldURL
        req.session.oldURL = null
        res.redirect(oldURL)
    } else {
        res.redirect('/store/user/profile')
    }
})

router.get('/signin', async (req, res) => {
    try {
        const messages = req.flash('error')
        await res.render('user/LoginPage', { title: 'Aligator Store | Login', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
    } catch (e) {
        console.log({ message: e })
    }
})

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/store/authorization/signin',
    failureFlash: true
}), (req, res) => {
    if (req.session.oldURL) {
        const oldURL = req.session.oldURL
        req.session.oldURL = null
        res.redirect(oldURL)
    } else {
        res.redirect('/store/user/profile')
    }
})

module.exports = router

function notLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/store/home')
}
