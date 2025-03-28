const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const logger = require("../../utils/logger");

const User = require("../../database/models/user.js");
const Profile = require("../../database/models/profile.js");
const Friends = require("../../database/models/friends.js");
const DiscoveryUser = require("../../database/models/DiscoveryUser.js");
const mnemonic = require("../../responses/fortniteConfig/discovery/mnemonic.json");
const mnemonic_Frontend = require("../../responses/fortniteConfig/discovery/mnemonic_Frontend.json");

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
    const accountId = "epic";

    const newUser = new User({
        accountInfo: {
            id: accountId,
            displayName: "Epic",
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

    const discoveryUser = new DiscoveryUser({
        accountId: accountId,
        displayName: "Epic",
        profile: {
            page: {
                "isFollowed": false,
                "displayName": "Epic Games",
                "surfaceName": "CreativeDiscoverySurface_EpicPage",
                "bio": "Play Fortnite your way. Choose an island and drop in!",
                "images": {
                    "avatar": "https://cdn2.unrealengine.com/epicgames-cretorprofile-192x192-cd5708661249.jpg",
                    "banner": "https://cdn2.unrealengine.com/epic-creator-profile-no-logo-2800x960-b1cee1ac257e.jpg"
                },
                "social": {
                    "youtube": "fortnite",
                    "tikTok": "@fortnite",
                    "twitter": "FortniteGame",
                    "discord": "fortnite",
                    "instagram": "fortnite"
                }
            },
            discoverySurface: [
                {
                    "lastVisited": "2025-02-23T21:18:10.865Z",
                    "linkCode": "set_br_playlists",
                    "isFavorite": false,
                    "globalCCU": 437881,
                    "lockStatus": "UNLOCKED",
                    "lockStatusReason": "RATING_THRESHOLD",
                    "isVisible": true,
                    "favoriteStatus": "NONE"
                },
                {
                    "lastVisited": "2025-02-07T01:47:35.244Z",
                    "linkCode": "set_figment_playlists",
                    "isFavorite": false,
                    "globalCCU": 86585,
                    "lockStatus": "UNLOCKED",
                    "lockStatusReason": "RATING_THRESHOLD",
                    "isVisible": true,
                    "favoriteStatus": "NONE"
                },
                {
                    "lastVisited": null,
                    "linkCode": "set_habanero_blastberry_playlists",
                    "isFavorite": false,
                    "globalCCU": 217890,
                    "lockStatus": "UNLOCKED",
                    "lockStatusReason": "RATING_THRESHOLD",
                    "isVisible": true,
                    "favoriteStatus": "NONE"
                }
            ]
        },
        createdIslands: mnemonic,
        createdIslands_Frontend: mnemonic_Frontend
    })
    await discoveryUser.save();

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