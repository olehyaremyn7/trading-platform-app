const { Router } = require('express');
const router = Router();
const passport = require('passport');

// get profile page // /store/user/profile
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/Profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
   req.logout();
   res.redirect('/store/home');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/store/home');
}