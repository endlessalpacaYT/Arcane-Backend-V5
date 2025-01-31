const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../../database/models/user.js");
const botDatabase = require("../../lobbyBot/User/database.js");

const errors = require("../../responses/errors.json");
const { createError } = require("../../utils/error");

async function Id(fastify, options) {
    // Category: Account
    // SubCategory: Email
    fastify.post('/id/api/email/verify/send', (request, reply) => {
        reply.status(204).send();
    })

    // idk the response for this one
    fastify.post('/id/api/email/verify', (request, reply) => {
        reply.status(204).send();
    })

    // SubCategory: Verify
    // idk the response for this one
    fastify.post('/id/api/account/verify/send', (request, reply) => {
        reply.status(204).send();
    })

    // idk the response for this one
    fastify.post('/id/api/account/verify', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/id/api/account/verify', (request, reply) => {
        reply.status(200).send({
            "email": "arcanev5@arcane.dev",
            "displayName": "ArcaneV5",
            "emailVerified": true,
            "platformRestrictionRequired": false
        });
    })

    // SubCategory: Misc

    // idk the response for this one
    fastify.post('/id/api/account/deletion/cancel', (request, reply) => {
        reply.status(204).send()
    })

    fastify.post('/id/api/account/displayName/validate', (request, reply) => {
        reply.status(200).send();
    })

    // idk the response for this one
    fastify.post('/id/api/account/heal/email', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/id/api/account', (request, reply) => {
        reply.status(200).send({
            "email": "arcanev5@arcane.dev",
            "hasHashedEmail": false,
            "displayName": "ArcaneV5",
            "switchable": true,
            "accountStatus": "ACTIVE",
            "hasPassword": true,
            "minor": false,
            "restricted": false
        })
    })

    // Category Auth
    // SubCategory: DeviceCode

    // idk the response for this one
    fastify.post('/id/api/device/:userCode/activate', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/id/api/device', (request, reply) => {
        reply.status(200).send({
            "userCode": "CVHWRDPZ",
            "expiresIn": 600,
            "interval": 10,
            "verificationUri": "https://www.epicgames.com/activate"
        })
    })

    fastify.get('/id/api/device/:userCode', (request, reply) => {
        reply.status(200).send({
            "clientId": "e49e067bb11c4722a34b2b3b8a6a6355",
            "prompt": "login",
            "state": {
                "flow": "quick"
            },
            "isLocal": true
        })
    })

    // SubCategory: ExchangeCode
    fastify.post('/id/api/exchange/generate', (request, reply) => {
        reply.status(200).send({
            "code": uuidv4()
        })
    })

    fastify.get('/id/api/exchange/:exchangeCode', (request, reply) => {
        reply.status(200).send({});
    })

    // SubCategory: Misc
    fastify.get('/id/api/continuation/:continuationToken', (request, reply) => {
        reply.status(200).send({
            "accountId": "ArcaneV5",
            "clientId": "xyza7891atVNaa9a4cJxNwHMzLUO65Ad"
        })
    })

    // gotta study this route!
    fastify.get('/id/api/redirect', (request, reply) => {
        if (request.query.redirectUrl) {
            reply.status(200).send({
                "redirectUrl": request.query.redirectUrl,
                "authorizationCode": null,
                "exchangeCode": "7d0dc2bc07e7463c9b44a711403862ba",
                "sid": null,
                "ssoV2Enabled": true
            });
        } else {
            reply.status(200).send({
                "redirectUrl": "https://localhost/launcher/authorized",
                "authorizationCode": null,
                "exchangeCode": "7d0dc2bc07e7463c9b44a711403862ba",
                "sid": null,
                "ssoV2Enabled": true
            });
        }
    })

    // Category: Misc
    fastify.get('/id/api/age-gate', (request, reply) => {
        reply.status(200).send({
            "country": "GB",
            "ageGateRequired": true,
            "ageOfConsent": 16,
            "ageRatingSystem": "PEGI"
        })
    })

    fastify.get('/id/api/analytics', (request, reply) => {
        reply.status(200).send({
            "trackingUuid": null,
            "accountId": null
        })
    })

    fastify.post('/id/api/analytics', (request, reply) => {
        reply.status(200).send({
            "trackingUuid": null,
            "accountId": null
        })
    })

    fastify.post('/id/api/client/:clientId/authorize', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get('/id/api/client/:clientId', (request, reply) => {
        reply.status(200).send({
            "clientId": request.params.clientId,
            "clientName": "launcherAppClient2",
            "redirectUrl": null,
            "internal": true,
            "mailingList": null,
            "native": false,
            "product": "default",
            "allowedScopes": [],
            "epicLoginOnly": false
        })
    })

    fastify.post('/id/api/state', (request, reply) => {
        reply.status(200).send({
            "redirectUrl": "http://localhost",
            "psnRedirectUrl": "https://sony.com",
            "oauthRedirectUrl": "http://fortnite.com",
            "isPopup": true,
            "isWeb": false,
            "steamAccountId": "1",
            "accountId": "ArcaneV5",
            "loginRequestId": "39032a71931a4f129f01d6899da9e036",
            "code": "39032a71931a4f129f01d6899da9e036",
            "allowThirdParties": true,
            "system": "PEGI",
            "rating": "unrated",
            "trackingUuid": uuidv4()
        })
    })

    fastify.get('/id/api/failure/:failureId', (request, reply) => {
        reply.status(200).send({
            "continuation": uuidv4(),
            "hasGuardianCode": false
        })
    })

    fastify.get('/id/api/location', (request, reply) => {
        reply.status(200).send({
            "country": "GB",
            "city": "Bridgwater",
            "coordinates": {
                "accuracy_radius": 20,
                "latitude": 50.1188,
                "longitude": 8.6843,
                "time_zone": "Europe/London"
            }
        });
    })

    fastify.post('/id/api/login', async (request, reply) => {
        const { email, password, rememberMe } = request.body;

        if (!email || !password) {
            return createError(errors.BAD_REQUEST.common, 400, reply);
        }
        let user;
        if (process.env.SINGLEPLAYER == "false") {
            user = await User.findOne({ "accountInfo.email": email });
            if (!user) {
                return createError(errors.NOT_FOUND.account.not_found, 404, reply);
            }

            const verifiedPass = await bcrypt.compare(password, user.security.password);
            if (!verifiedPass || user.security.banned == true) {
                return createError(errors.NOT_ALLOWED.common, 403, reply);
            }
        } else {
            user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
            if (!user) {
                user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
            }
        }

        reply.status(200).send();
    })

    fastify.get('/id/api/login', (request, reply) => {
        reply.status(304).send();
    })

    fastify.post('/id/api/logout', (request, reply) => {
        reply.status(200).send({
            "sid": ""
        });
    })

    fastify.get('/id/api/set-sid', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/id/api/client/:clientId/revoke', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get('/id/api/state/:state', (request, reply) => {
        reply.status(200).send({
            "isPopup": false,
            "isWeb": true,
            "oauthRedirectUrl": "https://epicgames.com/id/login/steam?prompt=",
            "ip": request.ip,
            "origin": "epicgames",
            "id": "ArcaneV5"
        })
    })

    fastify.get('/id/api/i18n', (request, reply) => {
        reply.status(304).send();
    })

    fastify.get('/id/api/authenticate', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/id/api/exchange', (request, reply) => {
        reply.status(200).send();
    })
}

module.exports = Id;