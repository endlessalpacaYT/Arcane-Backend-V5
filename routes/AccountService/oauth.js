require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/user");
const AuthorizationCode = require("../../database/models/authorizationCode.js");
const ExchangeCode = require("../../database/models/exchangeCode.js");

const botDatabase = require("../../lobbyBot/User/database.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const logger = require("../../utils/logger.js");
const permissions = require("../../responses/EpicConfig/Authorization/permissions.json");
const clientGrants = require("../../responses/EpicConfig/Authorization/clientGrants.json");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function oauth(fastify, options) {
    fastify.post('/account/api/oauth/token', async (request, reply) => {
        const { grant_type } = request.body;
        if (!grant_type) {
            return createError.createError(errors.BAD_REQUEST.common, 400, reply);
        }
        let client_id;

        try {
            client_id = Buffer.from(request.headers["authorization"].split(" ")[1], 'base64').toString().split(":");

            if (!client_id[1]) throw new Error("invalid client id");

            client_id = client_id[0];
        } catch {
            //client_id = "ec684b8c687f479fadea3cb2ad83f5c6";
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.oauth.invalid_client",
                "errorMessage": "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
                "messageVars": [],
                "numericErrorCode": 1011,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
                "error": "invalid_client"
            }, 400, reply);
        }
        if (!clientGrants[client_id]) {
            return createError.createError({
                "errorCode": "errors.com.epicgames.account.invalid_client_credentials",
                "errorMessage": "Sorry the client credentials you are using are invalid",
                "messageVars": [],
                "numericErrorCode": 18033,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": "Sorry the client credentials you are using are invalid",
                "error": "invalid_client"
            }, 400, reply);
        }
        if (!clientGrants[client_id].includes(grant_type)) {
            if (process.env.DISABLE_CLIENT_AUTHORIZATION != "true") {
                return createError.createError({
                    "errorCode": "errors.com.epicgames.common.oauth.unauthorized_client",
                    "errorMessage": `Sorry your client is not allowed to use the grant type ${grant_type}`,
                    "messageVars": [],
                    "numericErrorCode": 1015,
                    "originatingService": "com.epicgames.account.public",
                    "intent": "prod",
                    "error_description": `Sorry your client is not allowed to use the grant type ${grant_type}`,
                    "error": "unauthorized_client"
                }, 400, reply);
            }
        }

        if (grant_type == "authorization_code") {
            const { code, code_verifier, includePerms, token_type } = request.body;
            if (!code) {
                return createError.createError({
                    "errorCode": "errors.com.epicgames.common.oauth.invalid_request",
                    "errorMessage": "code is required.",
                    "messageVars": [],
                    "numericErrorCode": 1013,
                    "originatingService": "com.epicgames.account.public",
                    "intent": "prod",
                    "error_description": "code is required.",
                    "error": "invalid_request"
                }, 400, reply);
            }

            let user;
            if (process.env.SINGLEPLAYER == "false") {
                const authCode = await AuthorizationCode.findOne({ code: code });
                if (!authCode) {
                    return createError.createError({
                        "errorCode": "errors.com.epicgames.account.oauth.authorization_code_not_found",
                        "errorMessage": "Sorry the authorization code you supplied was not found. It is possible that it was no longer valid",
                        "messageVars": [],
                        "numericErrorCode": 18059,
                        "originatingService": "com.epicgames.account.public",
                        "intent": "prod",
                        "error_description": "Sorry the authorization code you supplied was not found. It is possible that it was no longer valid",
                        "error": "invalid_grant"
                    }, 400, reply);
                }
                await authCode.deleteOne();

                user = await User.findOne({ "accountInfo.id": authCode.id });
                if (!user) {
                    return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
                }
            } else {
                user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
                if (!user) {
                    user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
                }
            }

            const device_id = request.cookies.EPIC_DEVICE;

            const perms = [
                {
                    "resource": "launcher:download:live",
                    "action": 2
                },
                {
                    "resource": "catalog:shared:*",
                    "action": 2
                }
            ]

            const access_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                displayName: user.accountInfo.displayName,
                device_id: device_id,
                client_Id: client_id,
                auth_time: new Date().toISOString(),
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "2h" })

            const refresh_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                device_id: device_id,
                client_Id: client_id,
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "8h" })

            let response = {
                "access_token": token_type ? `${token_type}~${access_token}` : access_token,
                "expires_in": 7200,
                "expires_at": new Date(Date.now() + 7200 * 1000).toISOString(),
                "token_type": "bearer",
                "refresh_token": `eg1~${refresh_token}`,
                "refresh_expires": 28800,
                "refresh_expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
                "account_id": user.accountInfo.id,
                "client_id": client_id,
                "internal_client": true,
                "client_service": "prod-fn",
                "scope": [
                    "basic_profile"
                ],
                "displayName": user.accountInfo.displayName,
                "app": "prod-fn",
                "in_app_id": user.accountInfo.id,
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
                "acr": "urn:epic:loa:aal1",
                "auth_time": new Date().toISOString(),
                "device_id": device_id
            }
            if (includePerms == "true") {
                response = {
                    ...response,
                    perms: perms
                }
            }

            reply.status(200).send(response)
        } else if (grant_type == "client_credentials") {
            const { token_type } = request.body;
            const perms = permissions.defaults.client_credentials;

            const access_token = jwt.sign({
                auth_method: grant_type,
                client_id: client_id,
                auth_time: new Date().toISOString(),
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "4h" })

            reply.status(200).send({
                "access_token": token_type ? `${token_type}~${access_token}` : access_token,
                "expires_in": 14400,
                "expires_at": new Date(Date.now() + 14400 * 1000).toISOString(),
                "token_type": "bearer",
                "client_id": client_id,
                "internal_client": true,
                "client_service": "prod-fn",
                "product_id": "prod-fn",
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
            })
        } else if (grant_type == "continuation_token") {
            const { continuation_token } = request.body;
            // just send this for now, cba to do this and most clients dont allow this grant type anyway
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.oauth.unauthorized_client",
                "errorMessage": "Sorry your client is not allowed to use the grant type continuation_token",
                "messageVars": [],
                "numericErrorCode": 1015,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": "Sorry your client is not allowed to use the grant type continuation_token",
                "error": "unauthorized_client"
            }, 400, reply);
        } else if (grant_type == "device_auth") {
            const { account_id, device_id, secret } = request.body;
            // do this later when i have working device auth creation
            return createError.createError(errors.BAD_REQUEST.grants.disabled, 403, reply);
        } else if (grant_type == "device_code") {
            const { device_code } = request.body;
            // yet again do this later
            return createError.createError(errors.BAD_REQUEST.grants.disabled, 403, reply);
        } else if (grant_type == "exchange_code") {
            // Gonna revamp this soon
            const { exchange_code } = request.body;
            if (!exchange_code) {
                return reply.status(400).send();
            }

            let user;
            if (process.env.SINGLEPLAYER == "true") {
                user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
                if (!user) {
                    user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
                }
            } else {
                const existingCode = await ExchangeCode.findOne({ code: exchange_code });
                if (existingCode) {
                    await existingCode.deleteOne();
                } else {
                    return createError.createError({
                        "errorCode": "errors.com.epicgames.account.oauth.exchange_code_not_found",
                        "errorMessage": "Sorry the exchange code you supplied was not found. It is possible that it was no longer valid",
                        "messageVars": [],
                        "numericErrorCode": 18057,
                        "originatingService": "com.epicgames.account.public",
                        "intent": "prod",
                        "error_description": "Sorry the exchange code you supplied was not found. It is possible that it was no longer valid",
                        "error": "invalid_grant"
                    }, 400, reply);
                }
                const accountId = existingCode.id;

                user = await User.findOne({ "accountInfo.id": accountId });
                if (!user) {
                    return reply.status(403).send();
                }
            }

            const device_id = uuidv4();
            const perms = [
                {
                    "resource": "launcher:download:live",
                    "action": 2
                },
                {
                    "resource": "catalog:shared:*",
                    "action": 2
                }
            ]

            const access_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                displayName: user.accountInfo.displayName,
                device_id: device_id,
                client_Id: client_id,
                auth_time: new Date().toISOString(),
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "2h" })

            const refresh_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                device_id: device_id,
                client_Id: client_id,
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "8h" })

            reply.status(200).send({
                "access_token": `eg1~${access_token}`,
                "expires_in": 7200,
                "expires_at": new Date(Date.now() + 7200 * 1000).toISOString(),
                "token_type": "bearer",
                "refresh_token": `eg1~${refresh_token}`,
                "refresh_expires": 28800,
                "refresh_expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
                "account_id": user.accountInfo.id,
                "client_id": client_id,
                "internal_client": true,
                "client_service": "prod-fn",
                "displayName": user.accountInfo.displayName,
                "app": "prod-fn",
                "in_app_id": user.accountInfo.id,
                "product_id": "prod-fn",
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
            })
        } else if (grant_type == "external_auth") {
            const { external_auth_type, external_auth_token } = request.body;
            // probably wont do this at all since it requires external services to be connected to the backend
            return createError.createError(errors.BAD_REQUEST.grants.disabled, 403, reply);
        } else if (grant_type == "otp") {
            const { otp, challenge } = request.body;
            // like the last one, i prolly wont do this because i have to send text messages through the phone
            return createError.createError(errors.BAD_REQUEST.grants.disabled, 403, reply);
        } else if (grant_type == "password") {
            const { username, password, includePerms, token_type } = request.body;
            if (!username || !password) {
                return createError.createError(errors.BAD_REQUEST.common, 400, reply);
            }
            let user;

            if (process.env.SINGLEPLAYER == "false") {
                user = await User.findOne({ "accountInfo.email": username });
                if (!user) {
                    return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
                }

                const verifiedPass = await bcrypt.compare(password, user.security.password);
                if (!verifiedPass || user.security.banned == true) {
                    return createError.createError(errors.NOT_ALLOWED.common, 403, reply);
                }
            } else {
                user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
                if (!user) {
                    user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
                }
            }

            const device_id = uuidv4();

            const perms = [
                {
                    "resource": "launcher:download:live",
                    "action": 2
                },
                {
                    "resource": "catalog:shared:*",
                    "action": 2
                }
            ]

            const access_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                displayName: user.accountInfo.displayName,
                device_id: device_id,
                client_Id: client_id,
                auth_time: new Date().toISOString(),
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "2h" })

            const refresh_token = jwt.sign({
                auth_method: grant_type,
                account_id: user.accountInfo.id,
                device_id: device_id,
                client_Id: client_id,
                perms: perms
            }, process.env.JWT_SECRET, { expiresIn: "8h" })

            let response = {
                "access_token": token_type ? `${token_type}~${access_token}` : access_token,
                "expires_in": 7200,
                "expires_at": new Date(Date.now() + 7200 * 1000).toISOString(),
                "token_type": "bearer",
                "refresh_token": `eg1~${refresh_token}`,
                "refresh_expires": 28800,
                "refresh_expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
                "account_id": user.accountInfo.id,
                "acr": "urn:epic:loa:aal1",
                "client_id": client_id,
                "internal_client": true,
                "client_service": "prod-fn",
                "displayName": user.accountInfo.displayName,
                "app": "prod-fn",
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
                "auth_time": new Date().toISOString(),
                "in_app_id": user.accountInfo.id,
                "device_id": device_id
            }
            if (includePerms == "true") {
                response = {
                    ...response,
                    perms: perms
                }
            }

            reply.status(200).send(response)
        } else if (grant_type == "refresh_token") {
            const { refresh_token } = request.body;

            const userToken = jwt.verify(refresh_token.replace("eg1~", ""), process.env.JWT_SECRET);

            const user = await User.findOne({ "accountInfo.id": userToken.account_id });
            if (!user) {
                return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
            }
            const device_id = userToken.device_id;
            const client_id = userToken.client_id;

            const access_token = jwt.sign({
                auth_method: userToken.auth_method,
                account_id: user.accountInfo.id,
                displayName: user.accountInfo.displayName,
                device_id: device_id,
                client_Id: client_id,
                auth_time: new Date().toISOString(),
                perms: userToken.perms
            }, process.env.JWT_SECRET, { expiresIn: "2h" })

            const new_refresh_token = jwt.sign({
                auth_method: userToken.auth_method,
                account_id: user.accountInfo.id,
                device_id: device_id,
                client_Id: client_id,
                perms: userToken.perms
            }, process.env.JWT_SECRET, { expiresIn: "8h" })

            reply.status(200).send({
                "access_token": `eg1~${access_token}`,
                "expires_in": 7200,
                "expires_at": new Date(Date.now() + 7200 * 1000).toISOString(),
                "token_type": "bearer",
                "refresh_token": `eg1~${new_refresh_token}`,
                "refresh_expires": 28800,
                "refresh_expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
                "account_id": user.accountInfo.id,
                "client_id": client_id,
                "internal_client": true,
                "client_service": "fortnite",
                "displayName": user.accountInfo.displayName,
                "app": "fortnite",
                "in_app_id": user.accountInfo.id,
                "device_id": device_id
            })
        } else if (grant_type == "token_to_token") {
            const { access_token } = request.body;
            // litterally disabled on all public clients anyway, maybe i will make it...
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.oauth.unauthorized_client",
                "errorMessage": "Sorry your client is not allowed to use the grant type token_to_token",
                "messageVars": [],
                "numericErrorCode": 1015,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": "Sorry your client is not allowed to use the grant type token_to_token",
                "error": "unauthorized_client"
            }, 400, reply);
        } else {
            logger.backend(`Missing oauth/token grant type: ${grant_type}`);
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.oauth.unsupported_grant_type",
                "errorMessage": `Malformed grant type in token request: ${grant_type}`,
                "messageVars": [],
                "numericErrorCode": 1016,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": `Malformed grant type in token request: ${grant_type}`,
                "error": "unsupported_grant_type"
            }, 400, reply);
        }
    })

    // TODO: Make These eos routes Proper
    fastify.post('/publickey/v2/publickey/', async (request, reply) => {
        const { key, algorithm } = request.body;
        let user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
        if (!user) {
            user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
        }

        return reply.status(200).send({
            "key": key,
            "account_id": user.accountInfo.id,
            "key_guid": "2e57bba7-4a7a-423c-b4b4-853acfcf019c",
            "kid": "20230621",
            "expiration": "9999-12-31T23:59:59.999Z",
            "jwt": "ArcaneV5",
            "type": "legacy"
        })
    });

    fastify.post('/epic/oauth/v2/token', async (request, reply) => {
        const { grant_type } = request.body;
        if (grant_type == "refresh_token") {
            const { refresh_token } = request.body;
            const token = refresh_token.replace("eg1~", "");
            const userToken = jwt.verify(token, process.env.JWT_SECRET);
            const accountId = userToken.account_id;

            const newToken = jwt.sign({
                account_id: accountId
            }, process.env.JWT_SECRET, { expiresIn: "32h" })

            reply.status(200).send({
                "scope": request.body.scope,
                "token_type": "bearer",
                "access_token": newToken,
                "refresh_token": newToken,
                "id_token": newToken,
                "expires_in": 115200,
                "expires_at": new Date(Date.now() + 115200 * 1000).toISOString(),
                "refresh_expires_in": 115200,
                "refresh_expires_at": new Date(Date.now() + 115200 * 1000).toISOString(),
                "account_id": accountId,
                "client_id": userToken.client_Id,
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
                "selected_account_id": accountId,
                "merged_accounts": []
            })
        } else {
            logger.backend(`Missing oauth/token grant type: ${grant_type}`);
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.oauth.unsupported_grant_type",
                "errorMessage": `Malformed grant type in token request: ${grant_type}`,
                "messageVars": [],
                "numericErrorCode": 1016,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod",
                "error_description": `Malformed grant type in token request: ${grant_type}`,
                "error": "unsupported_grant_type"
            }, 400, reply);
        }
    });

    fastify.post('/epic/oauth/v2/tokenInfo', async (request, reply) => {
        let user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
        if (!user) {
            user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
        }

        reply.status(200).send({
            "active": true,
            "scope": "basic_profile openid offline_access",
            "token_type": "bearer",
            "expires_in": 2147483647,
            "expires_at": "9999-12-31T23:59:59.999Z",
            "account_id": user.accountInfo.id,
            "client_id": "ec684b8c687f479fadea3cb2ad83f5c6",
            "application_id": "fghi45672f0QV6b6B1KntLd7JR7RFLWc"
        })
    })

    fastify.post('/epic/oauth/v2/revoke', (request, reply) => {
        return reply.status(204).send()
    });

    fastify.get('/account/api/oauth/verify', { preHandler: tokenVerify }, (request, reply) => {
        const { authorization } = request.headers;
        const { includePerms } = request.query;

        let response = {
            "token": request.headers["authorization"].split(" ")[1],
            "session_id": uuidv4().replace(/-/ig, ""),
            "token_type": "bearer",
            "client_id": request.user.client_id,
            "internal_client": true,
            "client_service": "prod-fn",
            "account_id": request.user.account_id,
            "expires_in": 16462,
            "expires_at": new Date(Date.now() + 16462 * 1000).toISOString(),
            "auth_method": request.user.auth_method,
            "display_name": request.user.display_name,
            "app": "prod-fn",
            "in_app_id": request.user.account_id,
            "scope": [
                "basic_profile"
            ],
            "product_id": "prod-fn",
            "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
            "acr": "urn:epic:loa:aal2",
            "auth_time": request.user.auth_time
        }
        if (includePerms == "true") {
            response = {
                ...response,
                perms: request.user.perms
            }
        }

        reply.status(200).send(response)
    })

    // Create an exchange route
    fastify.get('/account/api/oauth/exchange', { preHandler: tokenVerify }, async (request, reply) => {
        const { consumingClientId, codeChallenge, codeChallengeMethod } = request.query;

        const existingCode = await ExchangeCode.findOne({ id: request.user.account_id });
        if (existingCode) {
            await existingCode.deleteOne();
        }

        const code = uuidv4().replace(/-/ig, "");

        const exchangeCode = new ExchangeCode({
            code: code,
            id: request.user.account_id
        })
        await exchangeCode.save();

        reply.status(200).send({
            "expiresInSeconds": 1200,
            "code": code,
            "creatingClientId": "ec684b8c687f479fadea3cb2ad83f5c6",
            "consumingClientId": consumingClientId ? consumingClientId : null
        })
    })

    // Create a device code route
    fastify.post('/account/api/oauth/deviceAuthorization', (request, reply) => {
        reply.status(200).send({
            "user_code": "ArcaneV5",
            "device_code": "ArcaneV5",
            "verification_uri": "https://www.epicgames.com/activate",
            "verification_uri_complete": "https://www.epicgames.com/activate?userCode=ArcaneV5",
            "prompt": "login",
            "expires_in": 600,
            "interval": 10,
            "client_id": "ec684b8c687f479fadea3cb2ad83f5c6"
        })
    })

    fastify.delete('/account/api/oauth/deviceAuthorization/:userCode', (request, reply) => {
        reply.status(204).send();
    })

    // Continuation Token Route, idk what the response should look like
    fastify.get('/account/api/oauth/continuationToken/:continuationToken', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/account/api/oauth/permissions', async (request, reply) => {
        const { authorization } = request.headers;
        const { includePerms } = request.query;
        if (!authorization) {
            return createError.createError(errors.BAD_REQUEST.common, 400, reply);
        }

        const token = authorization.replace("bearer ", "");
        const userToken = jwt.verify(token.replace("eg1~", ""), process.env.JWT_SECRET);

        reply.status(200).send(userToken.permissions);
    })

    fastify.delete('/account/api/oauth/sessions/kill/:session', (request, reply) => {
        return reply.status(204).send();
    })

    fastify.delete('/account/api/oauth/sessions/kill', (request, reply) => {
        return reply.status(204).send();
    })
}

module.exports = oauth;