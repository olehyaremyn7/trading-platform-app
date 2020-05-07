const express = require('express'); // express.js library
const mongoose = require('mongoose'); // mongoose for work with MongoDB
const config = require('config'); // config library
const cookieParser = require('cookie-parser'); // cookie-parser library to work with cookie
const bodyParser = require('body-parser');
const session = require('express-session'); // express-session library to work with session
const passport = require('passport'); // Passport is authentication middleware for Node.js.
const flash = require('connect-flash'); // flash messages
const expressValidator = require('express-validator'); // forms validation
const expressHandlebars = require('express-handlebars'); // presentation engine for best working with views
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
app.use(express.json({ extended: true })); // for using json
app.use(express.urlencoded({ extended: true })); // requests to the view body

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // forms validation
app.use(cookieParser()); // for using cookies
app.use(session({ // session settings
    secret: 'storeappsecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // connect session to the database
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash()); // flash messages
app.use(passport.initialize()); // passport initialize
app.use(passport.session()); // passport access to the session
// public folder connection
app.use(express.static(__dirname + '/public'));

// global property which available in views
app.use((req, res, next) => {
   res.locals.login = req.isAuthenticated();
   res.locals.session = req.session;
   next();
});

// Routes
app.use('/store/authorization', AuthorizationRouter); // authorization uri
app.use('/store/user', UserRouter); // user uri
app.use('/store/checkout', CheckoutRouter); // checkout uri
app.use('/store', StoreRouter); // store uri

// async function start to connect to the database and start server
const start = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
};

// call function which start server
start();