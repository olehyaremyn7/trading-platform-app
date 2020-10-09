const Product = require('../models/Product')
const mongoose = require('mongoose')
const config = require('../config/keys.dev.config')

const connect = async () => {
    try {
        console.log('Database connection...')
        setTimeout(() => {
            mongoose.connect(config.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
        }, 2000)

        console.log('Database connected')
    } catch (e) {
        console.log('Connection error:', e.message)
    }
}

connect()

const product = {
    imagePath: 'https://hotline.ua/img/tx/204/2042918805.jpg',
    title: 'Samsung Galaxy Note 10 Plus',
    category: 'Mobile phones',
    description: 'Представляем Galaxy Note10|10+. Мощность ноутбука, игровая консоль, профессиональная камера и умное электронное перо.',
    price: 500,
    rating: 0,
    state: 'New'
}

console.log('New data is uploaded to the database...')

const products = [ new Product(product) ]
let done = 0

for(let i = 0; i < products.length; i++) {
    products[i].save((err, result) => {
        done++;
        if (done === products.length) {
            mongoose.disconnect()
        }
    })
}

setTimeout(() => {
    console.log('New data added to database')
}, 2000)
