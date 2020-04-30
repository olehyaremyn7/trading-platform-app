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
const ShopRouter = require('./routes/shop');
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

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
    secret: 'storeappsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash()); // flash messages
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(express.json({ extended: true }));
app.use('/', ShopRouter);

// Connection to MongoDB
const start = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1)
    }
}

// Start server
start();