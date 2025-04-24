const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const User = require("../../database/models/user");
const Profile = require("../../database/models/profile");
const Friends = require("../../database/models/friends");

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

const commandInfo = {
    name: "create",
    description: "Create an account!",
    options: [
        {
            name: "email",
            description: "Your email.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "password",
            description: "Your password.",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: "username",
            description: "Your username.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
};

async function execute(interaction) {
    try {
        const { options } = interaction;

        const discordId = interaction.user.id;
        const email = options.get("email").value;
        const username = options.get("username").value;
        const password = options.get("password").value;

        const existingUser = await User.findOne({ 'accountInfo.id': discordId });
        if (existingUser) {
            const embed = new EmbedBuilder()
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

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            accountInfo: {
                id: discordId,
                displayName: username,
                email: email,
                company: username
            },
            security: {
                password: hashedPass
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

        const embed = new EmbedBuilder()
            .setColor("#a600ff") // Purple
            .setTitle("Success!")
            .setDescription(`Account created with username: ${username}!`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error('Error executing create command:', error);
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