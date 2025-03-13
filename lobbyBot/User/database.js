const axios = require("axios");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const logger = require("../../utils/logger");

const User = require("../../database/models/user.js");
const Profile = require("../../database/models/profile.js");
const Friends = require("../../database/models/friends.js");

const fullLocker = require("../../responses/fortniteConfig/FLAthena.json");

async function applyFullLocker(accountId) {
    const profile = await Profile.findOne({ accountId: accountId });
    fullLocker.accountId = accountId;
    profile.profiles.athena = fullLocker;

    await profile.updateOne({ $set: { profiles: profile.profiles } });
    logger.bot(`Applied Full Locker to the Bot!`);
}

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

async function createUser(displayName, password, email) {
    const hashedPass = await bcrypt.hash(password, 10);
    const accountId = uuidv4();

    const newUser = new User({
        accountInfo: {
            id: accountId,
            displayName: displayName,
            email: email
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
    await applyFullLocker(accountId);

    const friends = new Friends({
        created: new Date(),
        accountId: accountId
    });
    await friends.save();

    const user = await User.findOne({ 'accountInfo.id': accountId });
    return user;
}

async function syncEpicProfiles(accountId, token) {
    const profiles = await Profile.findOne({ accountId: accountId });
    if (!profiles) {
        console.warn("No profiles!");
        return;
    }

    const response = await axios.post(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${accountId}/client/QueryProfile?profileId=athena&rvn=-1`, {}, {
        headers: {
            authorization: token
        }
    })
    if (response.status == 200) {
        profiles.profiles["athena"] = response.data.profileChanges[0].profile;
        await profiles.updateOne({ $set: { [`profiles.athena`]: profiles.profiles["athena"] } });
    }

    return;
}

async function createEpicUser(accountId, token) {
    const response = await axios.get(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${accountId}`, {
        headers: {
            authorization: token
        }
    })
    if (response.status != 200) {
        console.warn("Error getting accountInfo!");
        return;
    }

    const newUser = new User({
        accountInfo: {
            id: accountId,
            displayName: response.data.displayName,
            email: response.data.email
        },
        security: {
            password: "none"
        },
        privacySettings: {
            accountId: accountId
        },
        stash: {
            "globalcash": 0
        }
    });
    await newUser.save();
    await createProfile(accountId);

    const user = await User.findOne({ 'accountInfo.id': accountId });
    return user;
}

async function addAllFriends() {
    let friendsCount = 0;
    
    const friends = await Friends.findOne({ accountId: global.botId });
    const users = await User.find();
    friends.list.accepted = [];
    const acceptedList = friends.list;

    users.forEach(user => {
        if (user.accountInfo.id == global.botId) {} else {
            friends.list.accepted.push({
                accountId: user.accountInfo.id,
                groups: [],
                mutual: 0,
                alias: "",
                note: "",
                favorite: false,
                created: new Date().toISOString()
            })
            friendsCount++;
        }
    });

    for (const user of users) {
        const friendsList = await Friends.findOne({ accountId: user.accountInfo.id });
        const acceptedList = friendsList.list;
        if (!friendsList.list.accepted.find(friend => friend.accountId == global.botId)) {
            friendsList.list.accepted.push({
                accountId: global.botId,
                groups: [],
                mutual: 0,
                alias: "",
                note: "",
                favorite: false,
                created: new Date().toISOString()
            });
            await friendsList.updateOne({ $set: { list: acceptedList } });
        }
    }

    await friends.updateOne({ $set: { list: acceptedList } });
    logger.bot(`Added ${friendsCount} Friends!`)
}

module.exports = {
    createUser,
    createEpicUser,
    addAllFriends,
    applyFullLocker,
    syncEpicProfiles
}