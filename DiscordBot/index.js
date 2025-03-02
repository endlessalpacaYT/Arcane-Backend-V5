const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
const fs = require("fs");
const path = require("path");

const logger = require("../utils/logger");

client.once("ready", () => {
    logger.discord("Bot is up and running!");
    client.user.setPresence({ activity: { name: `ArcaneV5`, type: "PLAYING" }, status: 'dnd' });
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
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./DiscordBot/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

client.login(process.env.DISCORD_TOKEN);
