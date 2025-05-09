const { EmbedBuilder } = require("discord.js");

const commandInfo = {
    name: "ping",
    description: "Check if the backend is online!"
};

async function execute(interaction) {
    try {
        const embed = new EmbedBuilder()
            .setColor("#a600ff") // Purple
            .setTitle("Pong!")
            .setDescription("The Backend Is Online!")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error executing ping command:', error);
        const embed = new EmbedBuilder()
            .setColor("#ff0000") // Red
            .setTitle("An Error Occurred!")
            .setDescription("Please Report This To The Staff/Developers!")
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}

module.exports = {
    commandInfo,
    execute
};