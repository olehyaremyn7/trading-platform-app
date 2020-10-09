module.exports = function (req, res, next) {
    res.status(404).render('shop/404Page', {
        title: 'Page not founded'
    })
}
