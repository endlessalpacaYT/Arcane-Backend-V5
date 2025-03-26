require("dotenv").config();
const logger = require("../utils/logger");

const database = require("./database/database");

const User = require("../database/models/user");

async function epicGames() {
    let account = await User.findOne({ 'accountInfo.email': "epicgames@epicgames.live" })
    if (!account) {
        bot = await database.createUser();
    }
    await database.updatePassword();
}

epicGames();