require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const functions = require("../../utils/functions");

const tokenVerify = require("../../middlewares/tokenVerify");
const { createError } = require("../../utils/error");

let buildUniqueId = {};
global.playerMode = [];

async function matchmaking(fastify) {
    fastify.get('/fortnite/api/matchmaking/session/findPlayer/:accountId', (request, reply) => {
        reply.status(200).send();
    })

    fastify.post('/fortnite/api/matchmaking/session/matchMakingRequest', (request, reply) => {
        reply.status(200).send([]);
    })

    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", (request, reply) => {
        if (typeof request.query.bucketId != "string") return reply.status(400);
        if (request.query.bucketId.split(":").length != 4) return reply.status(400);
        const bucketId = request.query.bucketId;

        buildUniqueId[request.params.accountId] = bucketId.split(":")[0];
        const region = bucketId.split(":")[2];
        const playlist = bucketId.split(":")[3];
        const playlists = require("../../gameserverConfig.json");
        let playerJoinToken;
        try {
            if (playlists[region] || playlists[region][playlist]) {
                const gameserver = functions.getRandomElement(playlists[region][playlist]);
                playerJoinToken = jwt.sign({
                    serverAddress: gameserver.gameserverIP,
                    serverPort: gameserver.gameserverPort,
                    PLAYLISTNAME_s: gameserver.PLAYLISTNAME_s,
                    REGION_s: region,
                    serverName: gameserver.serverName
                }, process.env.JWT_SECRET, { expiresIn: "1h" })

                global.playerMode.push(`${request.params.accountId}:${playerJoinToken}`);
            } else {
                return createError({
                    "errorCode": "errors.com.epicgames.gamemode.not_found",
                    "errorMessage": "Sorry, The game mode you were matchmaking has no available servers!",
                    "messageVars": [
                        "mms-player"
                    ],
                    "numericErrorCode": 4002,
                    "originatingService": "com.epicgames.mms.public",
                    "intent": "prod",
                    "error_description": "Sorry, The game mode you were matchmaking has no available servers!",
                    "error": "NOT_FOUND!"
                }, 404, reply);
            }
        } catch {
            return createError({
                "errorCode": "errors.com.epicgames.gamemode.not_found",
                "errorMessage": "Sorry, The game mode you were matchmaking has no available servers!",
                "messageVars": [
                    "mms-player"
                ],
                "numericErrorCode": 4002,
                "originatingService": "com.epicgames.mms.public",
                "intent": "prod",
                "error_description": "Sorry, The game mode you were matchmaking has no available servers!",
                "error": "NOT_FOUND!"
            }, 404, reply);
        }

        return reply.status(200).send({
            "serviceUrl": `ws://${process.env.MATCHMAKER_URL}`,
            "ticketType": "mms-player",
            "payload": "69=",
            "signature": "420="
        });
    });

    fastify.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", (request, reply) => {
        reply.status(200).send({
            "accountId": request.params.accountId,
            "sessionId": request.params.sessionId,
            "key": "AOJEv8uTFmUh7XM2328kq9rlAzeQ5xzWzPIiyKn2s7s="
        });
    });

    fastify.get("/fortnite/api/matchmaking/session/:sessionId", { preHandler: tokenVerify }, (request, reply) => {
        const accountId = request.user.account_id;
        let playerJoinToken;
        for (let i = 0; i < global.playerMode.length; i++) {
            if (global.playerMode[i].includes(accountId)) {
                playerJoinToken = global.playerMode[i].split(":")[1];
                global.playerMode.splice(i, 1);
                break;
            }
        }
        if (!playerJoinToken) {
            return reply.status(404).send();
        }
        const decodedToken = jwt.verify(playerJoinToken, process.env.JWT_SECRET);
        if (!decodedToken.serverAddress || !decodedToken.serverPort) {
            return reply.status(404).send()
        }

        reply.status(200).send({
            "id": request.params.sessionId,
            "ownerId": uuidv4().replace(/-/ig, "").toUpperCase(),
            "ownerName": decodedToken.serverName,
            "serverName": decodedToken.serverName,
            "serverAddress": decodedToken.serverAddress,
            "serverPort": decodedToken.serverPort,
            "maxPublicPlayers": 220,
            "openPublicPlayers": 175,
            "maxPrivatePlayers": 0,
            "openPrivatePlayers": 0,
            "attributes": {
                "REGION_s": decodedToken.REGION_s,
                "GAMEMODE_s": "FORTATHENA",
                "ALLOWBROADCASTING_b": true,
                "SUBREGION_s": "GB",
                "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                "tenant_s": "Fortnite",
                "MATCHMAKINGPOOL_s": "Any",
                "STORMSHIELDDEFENSETYPE_i": 0,
                "HOTFIXVERSION_i": 0,
                "PLAYLISTNAME_s": decodedToken.PLAYLISTNAME_s,
                "SESSIONKEY_s": uuidv4().replace(/-/ig, "").toUpperCase(),
                "TENANT_s": "Fortnite",
                "BEACONPORT_i": 15009
            },
            "publicPlayers": [],
            "privatePlayers": [],
            "totalPlayers": 45,
            "allowJoinInProgress": false,
            "shouldAdvertise": false,
            "isDedicated": false,
            "usesStats": false,
            "allowInvites": false,
            "usesPresence": false,
            "allowJoinViaPresence": true,
            "allowJoinViaPresenceFriendsOnly": false,
            "buildUniqueId": buildUniqueId[request.user.account_id] || "0",
            "lastUpdated": new Date().toISOString(),
            "started": false
        });
    });

    fastify.post('/api/verify/match', (request, reply) => {
        reply.status(200).send({
            "account_id": request.body.account_id,
            "data": request.body.data,
            "allow": true
        })
    })

    fastify.post("/fortnite/api/matchmaking/session/:sessionId/join", (request, reply) => {
        reply.status(204).send();
    });

    fastify.post("/fortnite/api/matchmaking/session/matchmakingrequest", (request, reply) => {
        reply.status(200).send([]);
    });
}

module.exports = matchmaking;