require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

let profilesDb;

function connectMongo() {
    const uri = process.env.PROFILES_MONGODB;
    if (!profilesDb) {
        try {
            profilesDb = mongoose.createConnection(uri);

            profilesDb.on("connected", () =>
                logger.database(`Profiles MongoDB Connected To ${uri}`)
            );

            profilesDb.on("error", (err) =>
                console.error(`Profiles DB connection error: ${err}`)
            );
        } catch (err) {
            console.error(`Error Connecting To MongoDB: ${err}`);
        }
    }
    return profilesDb;
}

module.exports = connectMongo;
