const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkIfUserExists, createAccount } = require('../../utils/create');
const logger = require('../../utils/logger');

const create = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Create an account in Jungle')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your username')
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options;
        const displayName = options.getString('username');
        const discordId = interaction.user.id;

        try {
            const userExists = await checkIfUserExists(discordId);
            if (userExists) {
                await interaction.reply("**You already created an account**");
            } else {
                await createAccount(discordId, displayName);
                
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Account Created')
                    .setDescription(`Your account has been created successfully!`);
        
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            logger.discord(error);
            await interaction.reply('An error occurred while creating your account.');
        }
    }
};

module.exports = { create };
