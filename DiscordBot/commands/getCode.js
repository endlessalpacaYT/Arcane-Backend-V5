const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const User = require("../../database/models/user");
const Profile = require("../../database/models/profile");
const Friends = require("../../database/models/friends");
const AuthorizationCode = require("../../database/models/authorizationCode");

async function createProfile(accountId) {
    let profiles = {};

    fs.readdirSync(path.join(__dirname, "..", "..", "responses", "fortniteConfig", "DefaultProfiles")).forEach(fileName => {
        const profile = require(path.join(__dirname, "..", "..", "responses", "fortniteConfig", "DefaultProfiles", fileName));

        profile.accountId = accountId;
        profile.created = new Date().toISOString();
        profile.updated = new Date().toISOString();

        profiles[profile.profileId] = profile;
    });

    const profileData = {
        created: new Date(),
        accountId: accountId,
        profiles: profiles
    };

    const profile = new Profile(profileData);
    await profile.save();
    return profile;
}

module.exports = {
    commandInfo: {
        name: "getcode",
        description: "Get The Authorization Code!",
        options: [],
    },
    execute: async (interaction) => {
        try {
            const { options } = interaction;

            const discordId = interaction.user.id;
            const username = interaction.user.username;

            const existingUser = await User.findOne({ 'accountInfo.id': discordId });
            if (existingUser) {
                const embed = new MessageEmbed()
                    .setColor("#ff0000") // Red
                    .setTitle("Account Already Exists!")
                    .setDescription("An account already exists with this Discord ID!")
                    .setTimestamp();
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            }

            const newUser = new User({
                accountInfo: {
                    id: discordId,
                    displayName: username,
                    email: email,
                    company: username
                },
                security: {
                    password: "none"
                },
                privacySettings: {
                    accountId: discordId,
                },
                stash: {
                    "globalcash": 0
                }
            });
            await newUser.save();
            createProfile(discordId);

            const friends = new Friends({
                created: new Date(),
                accountId: discordId,
            });
            await friends.save();

            const existingCode = await AuthorizationCode.findOne({ id: discordId });
            if (existingCode) {
                await existingCode.deleteOne();
            }

            const code = uuidv4().replace(/-/ig, "");

            const authCode = new authorizationCode({
                code: code,
                id: discordId,
                client_id: "ec684b8c687f479fadea3cb2ad83f5c6"
            })
            await authCode.save();

            const embed = new MessageEmbed()
                .setColor("#a600ff") // Purple
                .setTitle(`Success, Authorization code: ${code}`)
                .setDescription(`Account created with username: ${username}!`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
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