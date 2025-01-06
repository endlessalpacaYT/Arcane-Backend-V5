require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

let mainDb;

function connectMongo() {
    const uri = process.env.MONGODB;

    if (!mainDb) {
        try {
            mainDb = mongoose.createConnection(uri);

            mainDb.on("connected", () => 
                logger.database(`MongoDB Connected To ${uri}`)
            );

            mainDb.on("error", (err) => 
                console.error(`MongoDB connection error: ${err}`)
            );
        } catch (err) {
            console.error(`Error Connecting To MongoDB: ${err}`);
        }
    }

    return mainDb;
}

module.exports = connectMongo;