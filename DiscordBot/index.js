const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [Partials.Message, Partials.Channel]
});
const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");

client.once("ready", () => {
    logger.discord("Bot is up and running!");
    client.user.setPresence({ 
        activities: [{ name: `ArcaneV5`, type: ActivityType.Playing }], 
        status: 'dnd' 
    });
    let commands = client.application.commands;
    let registedCommands = 0;

    fs.readdirSync("./DiscordBot/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commands.create(command.commandInfo);
        registedCommands++;
    });
    logger.discord(`Registered ${registedCommands} commands!`);
});

client.on("interactionCreate", interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (fs.existsSync(`./DiscordBot/commands/${interaction.commandName}.js`)) {
        const command = require(`./commands/${interaction.commandName}.js`);
        command.execute(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
