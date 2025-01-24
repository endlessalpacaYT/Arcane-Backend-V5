require("dotenv").config();
const logger = require("../utils/logger");

const database = require("./User/database");
const token = require("./requests/token");

const User = require("../database/models/user");

const HOST = process.env.HOST || "127.0.0.1";
const ENABLED = Boolean(process.env.ENABLED) || false;

global.botId;
global.botEmail;
global.botToken;

async function startBot() {
    logger.bot(`Bot starting with displayName: ${process.env.DISPLAYNAME}`);
    let bot = await User.findOne({ 'accountInfo.email': `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` })
    if (!bot) {
        bot = await database.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`);
        logger.bot(`No account was found, Created one automatically, accountId: ${bot.accountInfo.id}`);
    }
    if (!bot.accountInfo.id || !bot.accountInfo.email) {
        throw new error("Critical: Bot does not have an accountId or email!");
    }
    global.botId = bot.accountInfo.id;
    global.botEmail = bot.accountInfo.email;
    logger.bot(`AccountId: ${global.botId}`);
    logger.bot(`Email: ${global.botEmail}`);
    logger.bot(`DisplayName: ${bot.accountInfo.displayName}`);

    await database.addAllFriends();

    const { access_token } = await token.obtainToken();
    global.botToken = access_token;
    
    if (!global.botToken) {
        logger.bot("Unable to login!");
    } else {
        logger.bot("Bot obtained the token!");
        require("./xmppClient/index");
    }
}

if (ENABLED) {
    startBot();
}