const { Router } = require('express');
const router = Router();
const csrf = require('csurf');
// csrf protection middleware
const csrfProtection = csrf();
router.use(csrfProtection);

// /store/authorization/signup
router.get('/signup', (req, res) => {
   res.render('user/SignUp', { csrfToken: req.csrfToken() })
});

router.post('/signup', (req, res) => {
   res.redirect('/home');
});

module.exports = router;