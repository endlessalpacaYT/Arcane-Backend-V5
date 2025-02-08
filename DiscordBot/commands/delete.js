const { MessageEmbed } = require("discord.js");

const User = require("../../database/models/user");
const Profile = require("../../database/models/profile");
const Friends = require("../../database/models/friends");

module.exports = {
    commandInfo: {
        name: "delete",
        description: "Delete your account!",
    },
    execute: async (interaction) => {
        try {
            const user = await User.findOne({ 'accountInfo.id': interaction.user.id });
            const profile = await Profile.findOne({ accountId: interaction.user.id });
            const friends = await Friends.findOne({ accountId: interaction.user.id });

            if (!user) {
                const embed = new MessageEmbed()
                    .setColor("#ff0000") // Red
                    .setTitle("An Error Occurred!")
                    .setDescription("You don't have an account!")
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            }

            await user.deleteOne();
            await profile.deleteOne();
            await friends.deleteOne();

            const embed = new MessageEmbed()
                .setColor("#a600ff") // Purple
                .setTitle("Account Deleted!")
                .setDescription("Your account has been successfully deleted!")
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error executing ping command:', error);
            const embed = new MessageEmbed()
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
}