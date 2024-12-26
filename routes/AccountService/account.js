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
    fastify.get('/account/api/public/account/ageGate', (request, reply) => {
        reply.status(200).send({
            "ageGateRequired": true
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
        const accountId = uuidv4();

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

        if (usernameOrEmail != user.accountInfo.email) {
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
        reply.status(200).send({})
    })

    // Delete Device Auth
    fastify.delete('/account/api/public/account/:accountId/deviceAuth/:deviceId', (request, reply) => {
        reply.status(204).send();
    })

    // Device Auth Info
    fastify.get('/account/api/public/account/:accountId/deviceAuth/:deviceId', (request, reply) => {
        reply.status(200).send({
            "deviceId": "06b96e4c93ce452590408e72f814dedf",
            "accountId": "ArcaneV5",
            "userAgent": "",
            "created": {
                "location": "United Kingdom",
                "ipAddress": "127.0.0.1",
                "dateTime": new Date().toISOString()
            },
            "lastAccess": {
                "location": "United Kingdom",
                "ipAddress": "127.0.0.1",
                "dateTime": new Date().toISOString()
            }
        })
    })

    fastify.get('/account/api/public/account/:accountId/deviceAuth', (request, reply) => {
        reply.status(200).send([
            {
                "deviceId": "06b96e4c93ce452590408e72f814dedf",
                "accountId": "ArcaneV5",
                "userAgent": "",
                "created": {
                    "location": "United Kingdom",
                    "ipAddress": "127.0.0.1",
                    "dateTime": new Date().toISOString()
                },
                "lastAccess": {
                    "location": "United Kingdom",
                    "ipAddress": "127.0.0.1",
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
        user.externalAuths.push(externalAuth)
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
        const user = await User.findOne({ 'accountInfo.id': request.params.accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(user.accountInfo)
    })

    // Lookup by account Ids 
    fastify.get('/account/api/public/account', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send([
            {
                ...user.accountInfo,
                "externalAuths": user.externalAuths
            }
        ])
    })

    fastify.get('/account/api/public/account/displayName/:displayName', { preHandler: tokenVerify }, async (request, reply) => {
        const user = await User.findOne({ 'accountInfo.displayName': request.params.displayName });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send({
            ...user.accountInfo,
            "externalAuths": user.externalAuths
        })
    })

    fastify.get('/account/api/public/account/email/:email', { preHandler: tokenVerify }, async (request, reply) => {
        const user = await User.findOne({ 'accountInfo.email': request.params.email });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send({
            "id": user.accountInfo.id,
            "displayName": user.accountInfo.displayName,
            "externalAuths": user.externalAuths
        })
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
}

module.exports = account;