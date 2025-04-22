require("dotenv").config();
const logger = require("../utils/logger");

const database = require("./database/database");
const DiscoverySystem = require("../database/models/DiscoverySystem");
const discoveryFunctions = require("../utils/discovery");

const User = require("../database/models/user");

async function epicGames() {
    let account = await User.findOne({ 'accountInfo.email': "epicgames@epicgames.live" })
    if (!account) {
        bot = await database.createUser();
        account = await User.findOne({ 'accountInfo.email': "epicgames@epicgames.live" })
    }
    await database.updatePassword();

    /*const discoverySystemProfile = await DiscoverySystem.findOne({ accountId: account.accountInfo.id });
    if (!discoverySystemProfile) {
        discoveryFunctions.addAllMnemonic(account.accountInfo.id);
    }*/
}

epicGames();