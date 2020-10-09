const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/keys.config')
const helmet = require('helmet')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const expressHandlebars = require('express-handlebars')
const MongoStore = require('connect-mongo')(session)
const StoreRouter = require('./routes/store.routes')
const AuthorizationRouter = require('./routes/authorization.routes')
const UserRouter = require('./routes/user.routes')
const CheckoutRouter = require('./routes/checkout.routes')
const errorHandler = require('./middleware/errors.middleware')
require('./config/passport')

const app = express()

const handlebars = expressHandlebars.create({
    defaultLayout: 'layout',
    extname: 'hbs'
})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}))
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + '/public'))

app.use((req, res, next) => {
   res.locals.login = req.isAuthenticated()
   res.locals.session = req.session
   next()
})

app.use('/store/authorization', AuthorizationRouter)
app.use('/store/user', UserRouter)
app.use('/store/checkout', CheckoutRouter)
app.use('/store', StoreRouter)

app.use(errorHandler)

module.exports = app
