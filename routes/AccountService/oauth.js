require("dotenv").config();
const User = require("../../database/models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const logger = require("../../utils/logger.js");

async function oauth(fastify, options) {
    fastify.post('/account/api/oauth/token', async (request, reply) => {
        const { grant_type } = request.body;
        if (!grant_type) {
            return createError.createError(errors.BAD_REQUEST.common, 400, reply);
        }
        let client_id;

        try {
            client_id = Buffer.from(req.headers["authorization"].split(" ")[1], 'base64').toString().split(":");

            if (!client_id[1]) throw new Error("invalid client id");

            client_id = client_id[0];
        } catch {
            client_id = "ec684b8c687f479fadea3cb2ad83f5c6";
        }
        if (grant_type == "password") {
            const { username, password, includePerms, token_type } = request.body;
            if (!username || !password) {
                return createError.createError(errors.BAD_REQUEST.common, 400, reply);
            }

            const user = await User.findOne({ "accountInfo.email": username });
            if (!user) {
                return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
            }
            const verifiedPass = await bcrypt.compare(password, user.security.password);
            if (!verifiedPass || user.security.banned == true) {
                return createError.createError(errors.NOT_ALLOWED.common, 403, reply);
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
                "client_service": "fortnite",
                "displayName": user.accountInfo.displayName,
                "app": "fortnite",
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
        } else if (grant_type == "client_credentials") {
            const { token_type } = request.body;
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
                client_id: client_id,
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
        } else if (grant_type == "refresh_token") {
            const { refresh_token } = request.body;
            console.log(refresh_token);

            const token = refresh_token.replace("bearer ", "");
            const userToken = jwt.verify(token.replace("eg1~", ""), process.env.JWT_SECRET);

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
        } else if (grant_type == "exchange_code") {
            return createError.createError(errors.BAD_REQUEST.grants.disabled, 400, reply);

            reply.status(200).send({
                "access_token": "eg1~ArcaneV5",
                "expires_in": 7200,
                "expires_at": new Date(Date.now() + 7200 * 1000).toISOString(),
                "token_type": "bearer",
                "refresh_token": "eg1~ArcaneV5",
                "refresh_expires": 28800,
                "refresh_expires_at": new Date(Date.now() + 28800 * 1000).toISOString(),
                "account_id": "ArcaneV5",
                "client_id": "ec684b8c687f479fadea3cb2ad83f5c6",
                "internal_client": true,
                "client_service": "prod-fn",
                "displayName": "ArcaneV5",
                "app": "prod-fn",
                "in_app_id": "ArcaneV5",
                "product_id": "prod-fn",
                "application_id": "fghi4567FNFBKFz3E4TROb0bmPS8h1GW"
            })
        } else {
            logger.backend(`Missing oauth/token grant type: ${grant_type}`);
            return createError.createError(errors.NOT_FOUND.grants.not_found, 404, reply);
        }
    })

    fastify.get('/account/api/oauth/verify', (request, reply) => {
        const { authorization } = request.headers;
        const { includePerms } = request.query;
        if (!authorization) {
            return createError.createError(errors.BAD_REQUEST.common, 400, reply);
        }

        const token = authorization.replace("bearer ", "");
        const userToken = jwt.verify(token.replace("eg1~", ""), process.env.JWT_SECRET);

        let response = {
            "token": token,
            "session_id": uuidv4(),
            "token_type": "bearer",
            "client_id": userToken.client_id,
            "internal_client": true,
            "client_service": "launcher",
            "account_id": userToken.account_id,
            "expires_in": 16462,
            "expires_at": new Date(Date.now() + 16462 * 1000).toISOString(),
            "auth_method": userToken.auth_method,
            "display_name": userToken.display_name,
            "app": "launcher",
            "in_app_id": userToken.account_id
        }
        if (includePerms == "true") {
            response = {
                ...response,
                perms: userToken.perms
            }
        }

        reply.status(200).send(response)
    })

    // Create an exchange route
    fastify.get('/account/api/oauth/exchange', (request, reply) => {
        reply.status(200).send({
            "expiresInSeconds": 299,
            "code": "ArcaneV5",
            "creatingClientId": "ec684b8c687f479fadea3cb2ad83f5c6"
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

    fastify.get('/account/api/oauth/permissions', (request, reply) => {
        reply.status(200).send([
            {
                "resource": "launcher:download:live",
                "action": 2
            },
            {
                "resource": "catalog:shared:*",
                "action": 2
            }
        ])
    })

    fastify.delete('/account/api/oauth/sessions/kill/:session', (request, reply) => {
        reply.status(204).send();
    })

    fastify.delete('/account/api/oauth/sessions/kill', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = oauth;