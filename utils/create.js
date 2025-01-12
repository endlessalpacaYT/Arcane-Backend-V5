const Profile = require("../databse/models/user.js");
const Profile = require("../databse/models/profile.js");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const fs = require("fs");
const logger = require("./logger");

const generateEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 12);
    return `${randomString}@ogfn.org`;
};

const generatePassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

function generateUUID() {
    return uuidv4();
}

function createProfiles(accountId) {
    let profiles = {};

    try {
        const files = fs.readdirSync("./responses/fortniteConfig/DefaultProfiles");

        files.forEach(fileName => {
            if (fileName.endsWith('.json')) {
                try {
                    const profile = require(`../responses/fortniteConfig/DefaultProfiles/${fileName}`);

                    if (!profile.profileId) {
                        console.error(`Profile file ${fileName} is missing profileId`);
                        return;
                    }

                    const newProfile = {
                        accountId: accountId,
                        profiles: {},
                        stats: profile.stats || {},
                        updated: new Date().toISOString(),
                        profileRevision: 1,
                        baseRevision: 1,
                        RVN: profile.rvn || 0,
                        items: profile.items || {},
                        commandRevision: profile.commandRevision || 0 
                    };

                    profiles[profile.profileId] = newProfile;

                } catch (error) {
                    console.error(`Error reading profile from ${fileName}:`, error);
                }
            } else {
                console.warn(`Skipping non-JSON file: ${fileName}`);
            }
        });
    } catch (error) {
        console.error("Error reading profile directory:", error);
    }

    if (Object.keys(profiles).length === 0) {
        console.warn("No valid profiles created from files.");
    }

    return profiles;
}

async function checkIfUserExists(discordId) {
    const user = await User.findOne({ discordId }).exec();
    return user !== null;
}

async function createAccount(discordId, username) {
    try {
        const userExists = await checkIfUserExists(discordId);
        if (userExists) {
            throw new Error("User already exists");
        }

        const email = generateEmail();
        const plainPassword = generatePassword();
        // const hashedPassword = await bcrypt.hash(plainPassword, 10); 
        const accountId = generateUUID();

        const newUser = await User.create({
            accountInfo: {
                id: accountId,
                displayName: username,
                name: "Jungle", 
                email,
                discordId,
            },
            security: {
                password: plainPassword,
            },
            privacySettings: {},
            stats: [],
            metadata: {},
            stash: {},
            receipts: [],
            externalAuths: [],
        });

        const profilesData = createProfiles(newUser.accountInfo.id);

        if (Object.keys(profilesData).length === 0) {
            throw new Error("No profiles created. Please check profile files.");
        }

        await Profile.create({
            created: new Date(),
            accountId: newUser.accountInfo.id,
            profiles: profilesData,
        });

        return newUser;
    } catch (error) {
        console.error("Error creating account:", error);
        return null;
    }
}

module.exports = { checkIfUserExists, createAccount };
