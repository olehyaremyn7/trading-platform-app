const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressHandlebars = require('express-handlebars');
const HomeRouter = require('./routes/home.routes');
const ProductsRouter = require('./routes/products.routes');
const AuthorizationRouter = require('./routes/authorization.routes');

const app = express();
const PORT = config.get('port') || 5000;
const handlebars = expressHandlebars.create({
    defaultLayout: 'layout',
    extname: 'hbs'
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'storeappsecret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json({ extended: true }));
app.use('/store', HomeRouter);
app.use('/store', ProductsRouter);
app.use('/store/authorization', AuthorizationRouter);

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

start();