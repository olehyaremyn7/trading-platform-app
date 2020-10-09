const app = require('./app')
const mongoose = require('mongoose')
const config = require('./config/keys.config')

const PORT = config.port || 5000

const start = async () => {
    try {
        await mongoose.connect((config.mongoURI), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
            .then(() => console.log('MongoDB database has been successfully connected. Expecting server to start ... '))
            .catch(error => console.log('Warning! An error occurred while connecting to the MongoDB database. Error: ' + error))

        app.listen(PORT, () => { console.log(`Server has been started on port ${PORT}...`) })
    } catch (error) {
        console.log('Warning! An error occurred while starting the server. Error: ' + error.message)
        process.exit(1)
    }
}

start()
