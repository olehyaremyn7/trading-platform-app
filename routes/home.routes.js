const { Router } = require('express');
const router = Router();

// get home page // /shop/home
router.get('/home', async (req, res) => {
    res.render('shop/HomePage', { title: 'Shop home page' })
});

module.exports = router;