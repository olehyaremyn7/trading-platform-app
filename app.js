const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const expressHandlebars = require('express-handlebars');
const MongoStore = require('connect-mongo')(session); // for session
// Routes initialization
const StoreRouter = require('./routes/store.routes');
const AuthorizationRouter = require('./routes/authorization.routes');
const UserRouter = require('./routes/user.routes');
const CheckoutRouter = require('./routes/checkout.routes');
require('./config/passport'); // passport config

const app = express();
const PORT = config.get('port') || 5000; // server port
const handlebars = expressHandlebars.create({
    defaultLayout: 'layout',
    extname: 'hbs'
}); // Express Handlebars initialization

// Express Handlebars settings
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// Express Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
    secret: 'storeappsecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash()); // flash messages
app.use(passport.initialize());
app.use(passport.session());
// public folder
app.use(express.static(__dirname + '/public'));

// global property which available in views
app.use((req, res, next) => {
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

// Routes
app.use('/store/authorization', AuthorizationRouter);
app.use('/store/user', UserRouter);
app.use('/store/checkout', CheckoutRouter);
app.use('/store', StoreRouter);

// Connection to MongoDB
const start = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
}

// Start server
start();