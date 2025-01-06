require("dotenv").config();
const mongoose = require("mongoose");

const logger = require("../utils/logger");

async function connectMongo() {
    const uri = process.env.MONGODB;
    try {
        mongoose.connect(uri);
        logger.database(`MongoDB Connected To ${uri}`);
    } catch (err) {
        console.error(`Error Connecting To MongoDB: ${err}`);
    }
}

module.exports = connectMongo;