const mongoose = require('mongoose');
const logger = require('../utils/logger');

let mainDb;

function connectMongo() {
    const uri = process.env.MONGODB;
    
    if (!mainDb) {
        mainDb = mongoose.createConnection(uri);

        mainDb.on('connected', () => 
            logger.database(`MongoDB Connected To ${uri}`)
        );

        mainDb.on('error', (err) => 
            logger.error(`MongoDB connection error: ${err}`)
        );
    }

    return mainDb;
}

module.exports = connectMongo;