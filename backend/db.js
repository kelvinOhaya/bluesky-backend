const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT_URL)
        console.log("Connected To MongoDB")
    } catch (error) {
        console.error('MongoDB connection FAIL', error)
        process.exit(1)
    }
}

module.exports = connectDB