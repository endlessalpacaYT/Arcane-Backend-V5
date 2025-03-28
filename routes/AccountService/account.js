require("dotenv").config();
const User = require("../../database/models/user.js");
const Profile = require("../../database/models/profile.js");
const Friends = require("../../database/models/friends.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function account(fastify, options) {
    // Category: Uncategorized
    fastify.get('/account/api/public/account/ageGate', { preHandler: tokenVerify }, (request, reply) => {
        reply.status(200).send({
            "ageGateRequired": false
        })
    })

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

    // Route for creating a user
    fastify.post('/account/api/public/account', async (request, reply) => {
        const { authenticate, tokenType, sendEmail } = request.query;
        const { name, lastName, preferredLanguage, displayName, phoneNumber, company, email, username, password, dateOfBirth } = request.body;
        if (!displayName || !email || !password) {
            return createError.createError(errors.BAD_REQUEST.common, 400, reply);
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return createError.createError(errors.BAD_REQUEST.account.account_already_exists, 400, reply);
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const accountId = uuidv4().replace(/-/ig, "");

        const newUser = new User({
            accountInfo: {
                id: accountId,
                displayName: displayName,
                email: email,
                company: company ? company : displayName
            },
            security: {
                password: hashedPass
            },
            privacySettings: {
                accountId: accountId
            },
            stash: {
                "globalcash": 0
            }
        });
        await newUser.save();
        createProfile(accountId);

        const friends = new Friends({
            created: new Date(),
            accountId: accountId
        });
        await friends.save();

        const user = await User.findOne({ 'accountInfo.id': accountId });
        reply.status(200).send({
            "accountInfo": user.accountInfo
        })
    })

    fastify.get('/account/api/accounts/:accountId/email', (request, reply) => {
        reply.status(204).send();
    })

    // Set Link Identity Type Route
    // idk the response
    fastify.post('/account/api/public/account/:accountId/linkIdentity', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/account/api/public/account/:accountId/platformToken/:externalAuthType/:clientId', { preHandler: tokenVerify }, async (request, reply) => {
        const { exchangeCode } = request.body;
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        const accessToken = jwt.sign({
            exchangeCode: exchangeCode,
            accountId: accountId,
            expiresIn: 3600,
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
        }, process.env.JWT_SECRET,
            { expiresIn: "1h" })

        reply.status(200).send({
            "accessToken": `ep1~${accessToken}`,
            "expiresIn": 3600,
            "expiresAt": new Date(Date.now() + 3600 * 1000).toISOString()
        })
    })

    // idk the response
    fastify.post('/account/api/public/account/:accountId/resetDisplayName', (request, reply) => {
        reply.status(204).send();
    })

    // Send password reset Route
    fastify.post('/account/api/accounts/:accountId/resetPassword', (request, reply) => {
        reply.status(204).send();
    })

    // idk the response
    fastify.post('/account/api/public/account/:email/sendSingleUsePassword', (request, reply) => {
        reply.status(204).send();
    })

    fastify.put('/account/api/public/account/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send({
            "accountInfo": user.accountInfo
        })
    })

    fastify.post('/account/api/public/account/:accountId/validateCreds', { preHandler: tokenVerify }, async (request, reply) => {
        const { usernameOrEmail, password } = request.body;
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        if (usernameOrEmail != user.accountInfo.email && usernameOrEmail != user.accountInfo.displayName) {
            return createError.createError(errors.NOT_ALLOWED.common, 403, reply);
        }

        const verifiedPass = bcrypt.compare(password, user.security.password);
        if (!verifiedPass) {
            return createError.createError(errors.NOT_ALLOWED.common, 403, reply);
        }

        reply.status(204).send();
    })

    // Category: DeviceAuth

    // Create Device Auth
    fastify.post('/account/api/public/account/:accountId/deviceAuth', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send({
            "deviceId": uuidv4(),
            "accountId": request.params.accountId,
            "secret": uuidv4(),
            "userAgent": request.headers["user-agent"],
            "created": {
                "location": request.location,
                "ipAddress": request.ip,
                "dateTime": new Date().toISOString()
            }
        })
    })

    // Delete Device Auth
    fastify.delete('/account/api/public/account/:accountId/deviceAuth/:deviceId', (request, reply) => {
        reply.status(204).send();
    })

    // Device Auth Info
    fastify.get('/account/api/public/account/:accountId/deviceAuth/:deviceId', (request, reply) => {
        reply.status(200).send({
            "deviceId": uuidv4(),
            "accountId": request.params.accountId,
            "secret": uuidv4(),
            "userAgent": request.headers["user-agent"],
            "created": {
                "location": request.location,
                "ipAddress": request.ip,
                "dateTime": new Date().toISOString()
            },
            "lastAccess": {
                "location": request.location,
                "ipAddress": request.ip,
                "dateTime": new Date().toISOString()
            }
        })
    })

    fastify.get('/account/api/public/account/:accountId/deviceAuth', (request, reply) => {
        reply.status(200).send([
            {
                "deviceId": uuidv4(),
                "accountId": request.params.accountId,
                "secret": uuidv4(),
                "userAgent": request.headers["user-agent"],
                "created": {
                    "location": request.location,
                    "ipAddress": request.ip,
                    "dateTime": new Date().toISOString()
                },
                "lastAccess": {
                    "location": request.location,
                    "ipAddress": request.ip,
                    "dateTime": new Date().toISOString()
                }
            }
        ])
    })

    // Category: ExternalAuth

    // Create External Auth Route
    // i really do not know how to do this so i will not make it proper! (same for all the other externalAuth stuff)
    fastify.post('/account/api/public/account/:accountId/externalAuths', { preHandler: tokenVerify }, async (request, reply) => {
        const { authType, externalAuthToken } = request.body;
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const externalAuth = {
            "accountId": user.accountId,
            "type": authType,
            "externalAuthId": user.accountInfo.id,
            "externalAuthIdType": `${authType}_login`,
            "externalDisplayName": user.accountInfo.displayName,
            "authIds": [
                {
                    "id": user.accountInfo.id,
                    "type": `${authType}_login`
                }
            ],
            "dateAdded": new Date().toISOString()
        }
        user.externalAuths = {
            ...user.externalAuths,
            [authType]: externalAuth
        }
        await user.save();

        reply.status(200).send(externalAuth)
    })

    // Delete External Auth Route
    // really dont know how to do this one so ima just delete all
    fastify.delete('/account/api/public/account/:accountId/externalAuths/:externalAuthType', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        user.externalAuths = [];
        await user.save();

        reply.status(204).send();
    })

    // info
    fastify.get('/account/api/public/account/:accountId/externalAuths/:externalAuthType', { preHandler: tokenVerify }, async (request, reply) => {
        const user = await User.findOne({ 'accountInfo.id': request.params.accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        // just send all for now
        reply.status(200).send(user.externalAuths);
    })

    fastify.get('/account/api/public/account/:accountId/externalAuths', { preHandler: tokenVerify }, async (request, reply) => {
        const user = await User.findOne({ 'accountInfo.id': request.params.accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(user.externalAuths);
    })

    // Category: Lookup

    // Lookup by External Display Name
    fastify.get('/account/api/public/account/lookup/externalAuth/:externalAuthType/displayName/:displayName',
        { preHandler: tokenVerify },
        async (request, reply) => {
            const user = await User.findOne({ 'accountInfo.displayName': request.params.displayName });
            if (!user) {
                return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
            }

            reply.status(200).send([
                {
                    ...user.accountInfo,
                    links: {},
                    externalAuths: user.externalAuths
                }
            ])
        })

    // Bulk Lookup by External Display Name
    fastify.post('/account/api/public/account/lookup/externalDisplayName', (request, reply) => {
        return reply.status(200).send({});

        reply.status(200).send({
            "ArcaneV5": [
                {
                    "accountId": "ArcaneV5",
                    "type": "xbl",
                    "externalAuthIdType": "xuid",
                    "externalDisplayName": "ArcaneV5"
                }
            ]
        })
    })

    // Bulk lookup by external Id
    fastify.post('/account/api/public/account/lookup/externalId', (request, reply) => {
        reply.status(200).send({})
    })

    fastify.get('/account/api/public/account/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': request.params.accountId });
        if (!user) {
            return createError.createError({
                "errorCode": "errors.com.epicgames.account.account_not_found",
                "errorMessage": `Sorry, we couldn't find an account for ${request.params.accountId}`,
                "messageVars": [
                    request.params.accountId
                ],
                "numericErrorCode": 18007,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod"
            }, 404, reply);
        }

        if (accountId == request.params.accountId) {
            return reply.status(200).send(user.accountInfo);
        } else {
            return reply.status(200).send({
                "id": user.accountInfo.id,
                "displayName": user.accountInfo.displayName,
                "externalAuths": user.externalAuths
            })
        }
    })

    // Lookup by account Ids 
    fastify.get('/account/api/public/account', { preHandler: tokenVerify }, async (request, reply) => {
        if (request.query == null) {
            return createError.createError({
                "errorCode": "errors.com.epicgames.account.invalid_account_id_count",
                "errorMessage": "Sorry, the number of account id should be at least one and not more than 100.",
                "messageVars": [
                    "100"
                ],
                "numericErrorCode": 18066,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod"
            }, 400, reply);
        }
        let response = [];

        if (typeof request.query.accountId == "string") {
            let user = await User.findOne({ 'accountInfo.id': request.query.accountId });

            if (user) {
                if (request.user.account_id = user.accountInfo.id) {
                    response.push({
                        ...user.accountInfo,
                        "externalAuths": user.externalAuths
                    })
                } else {
                    response.push({
                        "id": user.accountInfo.id,
                        "displayName": user.accountInfo.displayName,
                        "externalAuths": user.externalAuths
                    })
                }
            }
        } else {
            for (let accountId of request.query.accountId) {
                let user = await User.findOne({ 'accountInfo.id': accountId });
                if (user) {
                    if (request.user.account_id == accountId) {
                        response.push({
                            ...user.accountInfo,
                            "externalAuths": user.externalAuths
                        })
                    } else {
                        response.push({
                            "id": user.accountInfo.id,
                            "displayName": user.accountInfo.displayName,
                            "externalAuths": user.externalAuths
                        })
                    }
                }
            }
        }

        reply.status(200).send(response);
    })

    fastify.get('/account/api/public/account/displayName/:displayName', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.displayName': request.params.displayName });
        if (!user) {
            return createError.createError({
                "errorCode": "errors.com.epicgames.account.account_not_found",
                "errorMessage": `Sorry, we couldn't find an account for ${request.params.displayName}`,
                "messageVars": [
                    request.params.displayName
                ],
                "numericErrorCode": 18007,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod"
            }, 404, reply);
        }

        if (accountId == user.accountInfo.id) {
            return reply.status(200).send(user.accountInfo);
        } else {
            return reply.status(200).send({
                "id": user.accountInfo.id,
                "displayName": user.accountInfo.displayName,
                "externalAuths": user.externalAuths
            })
        }
    })

    fastify.get('/account/api/public/account/email/:email', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.email': request.params.email });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        if (accountId == user.accountInfo.id) {
            return reply.status(200).send(user.accountInfo);
        } else {
            return reply.status(200).send({
                "id": user.accountInfo.id,
                "displayName": user.accountInfo.displayName,
                "externalAuths": user.externalAuths
            })
        }
    })

    // Category: Metadata

    // Delete metadate key Route
    fastify.delete('/account/api/accounts/:accountId/metadata/:key', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        user.metadata.delete(request.params.key);
        await user.save();

        reply.status(204).send();
    })

    fastify.get('/account/api/accounts/:accountId/metadata', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(user.metadata)
    })

    // Get specific metadata key
    fastify.get('/account/api/accounts/:accountId/metadata/:key', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(user.metadata.get(request.params.key));
    })

    // Set a metadate key
    fastify.post('/account/api/accounts/:accountId/metadata', { preHandler: tokenVerify }, async (request, reply) => {
        const { key, value } = request.body;

        const accountId = request.user.account_id
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        user.metadata.set(key, value);
        await user.save();

        reply.status(204).send();
    })

    // more misc
    fastify.get('/sdk/v1/product/prod-fn', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/sdk/prod-fn.json"));
    })

    fastify.get("/sdk/v1/*", (request, reply) => {
        const sdk = require("../../responses/EpicConfig/sdk/sdkv1.json");
        reply.status(200).send(sdk);
    })

    fastify.get("/socialban/api/public/v1/*", (request, reply) => {
        reply.status(200).send({
            "bans": [],
            "warnings": []
        })
    })

    fastify.get("/presence/api/v1/_/:accountId/last-online", async (request, reply) => {
        const friends = await Friends.findOne({ accountId: request.params.accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        let response = {};
        await Promise.all(friends.list.accepted.map(async (user) => {
            const userData = await User.findOne({ 'accountInfo.id': user.accountId });
            if (userData) {
                if (userData.accountInfo.last_online) {
                    response = {
                        ...response,
                        [user.accountId]: [
                            {
                                "last_online": userData.accountInfo.last_online
                            }
                        ]
                    };
                } else {
                    userData.accountInfo.last_online = new Date().toISOString();
                    await userData.save();
                    response = {
                        ...response,
                        [user.accountId]: [
                            {
                                "last_online": new Date().toISOString()
                            }
                        ]
                    };
                }
            }
        }));

        const user = await User.findOne({ 'accountInfo.id': request.params.accountId });
        if (user) {
            if (user.accountInfo.last_online) {
                response = {
                    ...response,
                    [request.params.accountId]: [
                        {
                            "last_online": user.accountInfo.last_online
                        }
                    ]
                };
            } else {
                user.accountInfo.last_online = new Date().toISOString();
                await user.save();
                response = {
                    ...response,
                    [request.params.accountId]: [
                        {
                            "last_online": new Date().toISOString()
                        }
                    ]
                };
            }
        }

        reply.status(200).send(response);
    });

    fastify.get("/presence/api/v1/*", (request, reply) => {
        reply.status(204).send();
    })

    fastify.post("/presence/api/v1/*", (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/v1/avatar/fortnite/ids', async (request, reply) => {
        let response = [];
        let accountIds = request.query.accountIds.split(",");
        //console.log(accountIds);

        for (let accountId of accountIds) {
            const profiles = await Profile.findOne({ accountId: accountId }).lean();
            const profile = profiles.profiles["athena"];

            if (profile) {
                let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
                //console.log(profile.items[activeLoadout].attributes.locker_slots_data.slots.Character.items[0].toUpperCase())

                response.push({
                    "accountId": accountId,
                    "namespace": "fortnite",
                    "avatarId": profile.items[activeLoadout].attributes.locker_slots_data.slots.Character.items[0].toUpperCase()
                })
            }
        }

        return reply.status(200).send(response);
    })

    fastify.post("/api/v1/user/setting", (request, reply) => {
        reply.status(204).send();
    })

    fastify.get("/api/v1/Fortnite/get", (request, reply) => {
        const sdk = require("../../responses/EpicConfig/sdk/sdkv1.json");
        reply.status(200).send(sdk);
    })

    fastify.post('/fortnite/api/game/v2/profileToken/verify/:accountId', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/auth/v1/turn/credentials', (request, reply) => {
        reply.status(200).send({
            "username": "",
            "password": "",
            "ttl": 3600000,
            "uris": []
        });
    })

    fastify.get('/api/v1/access/*', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = account;
