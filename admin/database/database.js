const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const logger = require("../../utils/logger");

const User = require("../../database/models/user.js");
const Profile = require("../../database/models/profile.js");
const Friends = require("../../database/models/friends.js");

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

async function createUser() {
    const hashedPass = await bcrypt.hash(process.env.JWT_SECRET, 10);
    const accountId = "EpicAdminOperationsAccount";

    const newUser = new User({
        accountInfo: {
            id: accountId,
            displayName: "Epic Games",
            email: "epicgames@epicgames.live"
        },
        security: {
            password: hashedPass
        },
        privacySettings: {
            accountId: accountId
        },
        stash: {
            "globalcash": 5000
        }
    });
    await newUser.save();
    await createProfile(accountId);

    const friends = new Friends({
        created: new Date(),
        accountId: accountId
    });
    await friends.save();

    const user = await User.findOne({ 'accountInfo.id': accountId });
    return user;
}

async function updatePassword() {
    let account = await User.findOne({ 'accountInfo.email': "epicgames@epicgames.live" })
    const hashedPass = await bcrypt.hash(process.env.JWT_SECRET, 10);
    account.security.password = hashedPass;
    await account.save();
}

module.exports = {
    createUser,
    updatePassword
}