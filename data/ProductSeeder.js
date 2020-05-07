const Product = require('../models/Product'); // import Product schema
const mongoose = require('mongoose');

// MongoDB URI which connect application with cloud database MongoDB Atlas
const mongoURI = 'mongodb+srv://Oleh:shop_app_mongo@storeappcluster-hbatf.azure.mongodb.net/app';

// async function for connect with MongoDB
const connect = async () => {
    try {
        console.log('Database connection...')
        setTimeout(() => {
            mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }, 2000);

        console.log('Database connected');
    } catch (e) {
        console.log('Connection error:', e.message);
    }
}

// call function which connecting with MongoDB
connect();

// product object // insert new product data here
const product = {
    imagePath: 'https://i2.rozetka.ua/goods/12996210/105097122_images_12996210072.jpg',
    title: 'CHRISTIAN DIOR DIOR HOMME SPORT',
    category: 'Accessories',
    description: 'For strong, athletic men. Refers to the "aromatic, citrus" family.',
    price: 70
};

console.log('New data is uploaded to the database...');
// new data is uploaded to the database
const products = [ new Product(product) ];

let done = 0;
for(let i = 0; i < products.length; i++) {
    // save new product in MongoDB
    products[i].save((err, result) => {
        done++;
        if (done === products.length) {
            // disconnect from the database
            mongoose.disconnect();
        }
    });
}

setTimeout(() => {
    console.log('New data added to database');
}, 2000);