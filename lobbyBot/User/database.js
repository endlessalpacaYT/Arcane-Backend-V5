const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const logger = require("../../utils/logger");

const User = require("../../database/models/user.js");
const Profile = require("../../database/models/profile.js");
const Friends = require("../../database/models/friends.js");
const DiscoveryUser = require("../../database/models/DiscoveryUser.js");
const DiscoverySystem = require("../../database/models/DiscoverySystem.js");

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
    const accountId = uuidv4().replace(/-/ig, "");

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

    const discoveryUser = new DiscoveryUser({
        accountId: accountId,
        displayName: displayName,
        profile: {
            page: {
                "isFollowed": true,
                "displayName": "ArcaneV5",
                "surfaceName": "CreativeDiscoverySurface_ArcanePage",
                "bio": "Welcome to ArcaneV5, Powering better multiplayer experiences than before!",
                "images": {
                    "avatar": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                    "banner": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5.png"
                },
                "social": {
                    "youtube": "ArcaneV5",
                    "tikTok": "@ArcaneV5",
                    "twitter": "Pongo_x86",
                    "discord": "ArcaneV5",
                    "instagram": "ArcaneV5"
                }
            },
            discoverySurface: [
                {
                    "lastVisited": "2025-02-23T21:18:10.865Z",
                    "linkCode": "0000-0000-0001",
                    "isFavorite": false,
                    "globalCCU": 2518902,
                    "lockStatus": "UNLOCKED",
                    "lockStatusReason": "RATING_THRESHOLD",
                    "isVisible": true,
                    "favoriteStatus": "NONE"
                }
            ]
        },
        createdIslands: [
            {
                "namespace": "fn",
                "accountId": accountId,
                "creatorName": "ArcaneV5",
                "mnemonic": "0000-0000-0001",
                "linkType": "BR:Playlist",
                "metadata": {
                    "internal_description_tags": [],
                    "code": "0000-0000-0001",
                    "gameFeaturesets": [],
                    "actuallyFound": true,
                    "public_modules": {},
                    "creatorName": "ArcaneV5",
                    "image_urls": {
                        "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png"
                    },
                    "moderationStatus": "Approved",
                    "alt_introduction": {
                        "de": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ru": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ko": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "pt-BR": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "en": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "it": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "fr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "es": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "es-MX": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ar": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ja": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "pl": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "tr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!"
                    },
                    "locale": "en",
                    "title": "ArcaneV5",
                    "video_vuid": "",
                    "thumbnail_url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
                    "mode": "live",
                    "matchmaking": {
                        "override_playlist": "playlist_defaultsolo"
                    },
                    "alt_tagline": {
                        "de": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ru": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ko": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "pt-BR": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "en": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "it": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "fr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "es": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "es-MX": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ar": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "ja": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "pl": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                        "tr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!"
                    },
                    "ratings": {
                        "boards": {
                            "ACB": {
                                "descriptors": [
                                    "ACB_MildViolence",
                                    "ACB_ScaryScenes",
                                    "ACB_OnlineInteractivityAndChat_v10_0"
                                ],
                                "rating_overridden": false,
                                "rating": "ACB_AGE_PG",
                                "initial_rating": "ACB_AGE_PG",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "PEGI": {
                                "descriptors": [
                                    "PEGI_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "PEGI_AGE_12",
                                "initial_rating": "PEGI_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Generic": {
                                "descriptors": [
                                    "GEN_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "GEN_AGE_12",
                                "initial_rating": "GEN_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ClassInd": {
                                "descriptors": [
                                    "ClassInd_Violencia"
                                ],
                                "rating_overridden": false,
                                "rating": "CLASSIND_AGE_10",
                                "initial_rating": "CLASSIND_AGE_10",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "USK": {
                                "descriptors": [
                                    "USK_FantasyGewalt_v9_0",
                                    "USK_DustereAtmosphare_v10_0"
                                ],
                                "rating_overridden": false,
                                "rating": "USK_AGE_12",
                                "initial_rating": "USK_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "GRAC": {
                                "descriptors": [
                                    "GRAC_Violence_v7_1",
                                    "GRAC_Fear_v7_1"
                                ],
                                "rating_overridden": false,
                                "rating": "GRAC_AGE_ALL",
                                "initial_rating": "GRAC_AGE_ALL",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ESRB": {
                                "descriptors": [
                                    "ESRB_Violence"
                                ],
                                "rating_overridden": false,
                                "rating": "ESRB_AGE_T",
                                "initial_rating": "ESRB_AGE_T",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Russia": {
                                "descriptors": [
                                    "RUS_Violence_v7_0"
                                ],
                                "rating_overridden": false,
                                "rating": "RUSSIA_AGE_16",
                                "initial_rating": "RUSSIA_AGE_16",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            }
                        }
                    },
                    "product_tag": "Product.BR.Build.Solo",
                    "fallback_links": {
                        "graceful": "playlist_respawn_24_alt"
                    },
                    "dynamicXp": {
                        "uniqueGameVersion": 44,
                        "calibrationPhase": "LiveXp"
                    },
                    "machineTranslationPreferences": {
                        "tagline": true,
                        "title": true,
                        "introduction": true
                    },
                    "introduction": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                    "lobby_background_image_urls": {
                        "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png"
                    },
                    "quicksilver_id": "938c12a3-77b5-4638-a1bd-907350c17b5b",
                    "image_url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
                    "created": "2025-02-25T05:17:47.695",
                    "published": "2024-09-06T19:32:05.942",
                    "version": 44,
                    "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
                    "alt_title": {
                        "de": "ArcaneV5",
                        "ru": "ArcaneV5",
                        "ko": "ArcaneV5",
                        "pt-BR": "ArcaneV5",
                        "en": "ArcaneV5",
                        "it": "ArcaneV5",
                        "fr": "ArcaneV5",
                        "es": "ArcaneV5",
                        "es-MX": "ArcaneV5",
                        "ar": "ArcaneV5",
                        "ja": "ArcaneV5",
                        "pl": "ArcaneV5",
                        "tr": "ArcaneV5"
                    },
                    "tagline": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                    "square_image_urls": {
                        "url_s": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                        "url_m": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                        "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png"
                    },
                    "supportCode": "ArcaneV5",
                    "projectId": "9827dcef-4ba6-b29f-fb37-d3b7a1a04219",
                    "attributions": [],
                    "account": "ArcaneV5"
                },
                "version": 44,
                "active": true,
                "disabled": true,
                "created": "2025-02-25T05:17:47.695Z",
                "published": "2024-09-06T19:32:05.942Z",
                "descriptionTags": [
                    "Backend",
                    "ArcaneV5",
                    "Arcane Series",
                    "ObsessedTech"
                ],
                "moderationStatus": "Approved",
                "lastActivatedDate": "2025-02-25T05:17:47.914Z",
                "discoveryIntent": "PUBLIC",
                "linkState": "LIVE"
            }
        ],
        createdIslands_Frontend: [
            {
                "lastVisited": "2025-02-23T21:18:10.865Z",
                "linkCode": "0000-0000-0001",
                "isFavorite": false,
                "globalCCU": 2518902,
                "lockStatus": "UNLOCKED",
                "lockStatusReason": "RATING_THRESHOLD",
                "isVisible": true,
                "favoriteStatus": "NONE"
            }
        ]
    })
    await discoveryUser.save();

    const discoverySystem = new DiscoverySystem({
        "namespace": "fn",
        "accountId": accountId,
        "creatorName": "ArcaneV5",
        "mnemonic": "0000-0000-0001",
        "linkType": "BR:Playlist",
        "metadata": {
            "internal_description_tags": [],
            "code": "0000-0000-0001",
            "gameFeaturesets": [],
            "actuallyFound": true,
            "public_modules": {},
            "creatorName": "ArcaneV5",
            "image_urls": {
                "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png"
            },
            "moderationStatus": "Approved",
            "alt_introduction": {
                "de": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ru": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ko": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "pt-BR": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "en": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "it": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "fr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "es": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "es-MX": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ar": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ja": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "pl": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "tr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!"
            },
            "locale": "en",
            "title": "ArcaneV5",
            "video_vuid": "",
            "thumbnail_url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
            "mode": "live",
            "matchmaking": {
                "override_playlist": "playlist_defaultsolo"
            },
            "alt_tagline": {
                "de": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ru": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ko": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "pt-BR": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "en": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "it": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "fr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "es": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "es-MX": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ar": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "ja": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "pl": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
                "tr": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!"
            },
            "ratings": {
                "boards": {
                    "ACB": {
                        "descriptors": [
                            "ACB_MildViolence",
                            "ACB_ScaryScenes",
                            "ACB_OnlineInteractivityAndChat_v10_0"
                        ],
                        "rating_overridden": false,
                        "rating": "ACB_AGE_PG",
                        "initial_rating": "ACB_AGE_PG",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "PEGI": {
                        "descriptors": [
                            "PEGI_ModerateViolence"
                        ],
                        "rating_overridden": false,
                        "rating": "PEGI_AGE_12",
                        "initial_rating": "PEGI_AGE_12",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "Generic": {
                        "descriptors": [
                            "GEN_ModerateViolence"
                        ],
                        "rating_overridden": false,
                        "rating": "GEN_AGE_12",
                        "initial_rating": "GEN_AGE_12",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "ClassInd": {
                        "descriptors": [
                            "ClassInd_Violencia"
                        ],
                        "rating_overridden": false,
                        "rating": "CLASSIND_AGE_10",
                        "initial_rating": "CLASSIND_AGE_10",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "USK": {
                        "descriptors": [
                            "USK_FantasyGewalt_v9_0",
                            "USK_DustereAtmosphare_v10_0"
                        ],
                        "rating_overridden": false,
                        "rating": "USK_AGE_12",
                        "initial_rating": "USK_AGE_12",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "GRAC": {
                        "descriptors": [
                            "GRAC_Violence_v7_1",
                            "GRAC_Fear_v7_1"
                        ],
                        "rating_overridden": false,
                        "rating": "GRAC_AGE_ALL",
                        "initial_rating": "GRAC_AGE_ALL",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "ESRB": {
                        "descriptors": [
                            "ESRB_Violence"
                        ],
                        "rating_overridden": false,
                        "rating": "ESRB_AGE_T",
                        "initial_rating": "ESRB_AGE_T",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    },
                    "Russia": {
                        "descriptors": [
                            "RUS_Violence_v7_0"
                        ],
                        "rating_overridden": false,
                        "rating": "RUSSIA_AGE_16",
                        "initial_rating": "RUSSIA_AGE_16",
                        "interactive_elements": [
                            "IE_UsersInteract"
                        ]
                    }
                }
            },
            "product_tag": "Product.BR.Build.Solo",
            "fallback_links": {
                "graceful": "playlist_respawn_24_alt"
            },
            "dynamicXp": {
                "uniqueGameVersion": 44,
                "calibrationPhase": "LiveXp"
            },
            "machineTranslationPreferences": {
                "tagline": true,
                "title": true,
                "introduction": true
            },
            "introduction": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
            "lobby_background_image_urls": {
                "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png"
            },
            "quicksilver_id": "938c12a3-77b5-4638-a1bd-907350c17b5b",
            "image_url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
            "created": "2025-02-25T05:17:47.695",
            "published": "2024-09-06T19:32:05.942",
            "version": 44,
            "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
            "alt_title": {
                "de": "ArcaneV5",
                "ru": "ArcaneV5",
                "ko": "ArcaneV5",
                "pt-BR": "ArcaneV5",
                "en": "ArcaneV5",
                "it": "ArcaneV5",
                "fr": "ArcaneV5",
                "es": "ArcaneV5",
                "es-MX": "ArcaneV5",
                "ar": "ArcaneV5",
                "ja": "ArcaneV5",
                "pl": "ArcaneV5",
                "tr": "ArcaneV5"
            },
            "tagline": "Welcome To ArcaneV5!\nWe hope you have an amazing experience!",
            "square_image_urls": {
                "url_s": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                "url_m": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                "url": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png"
            },
            "supportCode": "ArcaneV5",
            "projectId": "9827dcef-4ba6-b29f-fb37-d3b7a1a04219",
            "attributions": [],
            "account": "ArcaneV5"
        },
        "version": 44,
        "active": true,
        "disabled": true,
        "created": "2025-02-25T05:17:47.695Z",
        "published": "2024-09-06T19:32:05.942Z",
        "descriptionTags": [
            "Backend",
            "ArcaneV5",
            "Arcane Series",
            "ObsessedTech"
        ],
        "moderationStatus": "Approved",
        "lastActivatedDate": "2025-02-25T05:17:47.914Z",
        "discoveryIntent": "PUBLIC",
        "linkState": "LIVE"
    })
    await discoverySystem.save();

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
        if (user.accountInfo.id == global.botId) { } else {
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
        if (!friendsList || !friendsList.list) { } else {
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
    }

    await friends.updateOne({ $set: { list: acceptedList } });
    logger.bot(`Added ${friendsCount} Friends!`)
}

module.exports = {
    createUser,
    addAllFriends,
    applyFullLocker
}