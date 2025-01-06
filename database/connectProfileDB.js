const mongoose = require('mongoose');
const logger = require('../utils/logger');

let profilesDB;

function connectMongo() {
    const uri = process.env.PROFILES_MONGODB;
    
    if (!profilesDB) {
        profilesDB = mongoose.createConnection(uri);

        profilesDB.on('connected', () => 
            logger.database(`MongoDB Connected To ${uri}`)
        );

        profilesDB.on('error', (err) => 
            logger.error(`MongoDB connection error: ${err}`)
        );
    }

    return profilesDB;
}

module.exports = connectMongo;