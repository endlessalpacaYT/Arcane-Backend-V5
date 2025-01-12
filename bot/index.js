const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const dotenv = require('dotenv');

dotenv.config();

const token = "MTI4ODg1NTI2MjI3MDE5MzgyNQ.G7zjQJ.5WJDdBaaZtjpSfjFlWMclrmXPD2wZf4nKSmn7A";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    logger.discord(`Logged in as ${client.user?.username}`);

    const commands = client.application?.commands;

    try {
        const commandsDir = path.join(__dirname, 'commands');
        const files = await fs.readdir(commandsDir);

        for (const file of files) {
            if (file.endsWith('.js')) {
                const commandPath = path.join(commandsDir, file);
                const commandModule = require(commandPath);

                if (commandModule.create && commandModule.create.data) {
                    await commands?.create(commandModule.create.data.toJSON());
                    logger.discord(`Registered command: ${commandModule.create.data.name}`);
                } else {
                    logger.discord(`Command in ${file} does not have a valid structure.`);
                }
            }
        }
    } catch (error) {
        logger.discord('Error loading commands:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const commandName = interaction.commandName;

    try {
        const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
        await fs.access(commandPath);
        const commandModule = require(commandPath);
        await commandModule.create.execute(interaction);
    } catch (error) {
        logger.error(`Command not found: ${commandName}`, error);
        await interaction.reply({ content: 'An error occurred while executing that command.', ephemeral: true });
    }
});

client.login(token);

module.exports = client;