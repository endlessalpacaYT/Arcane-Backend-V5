require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const tokenVerify = require("../../middlewares/tokenVerify");

let buildUniqueId = {};
let playerMode = [];

async function matchmaking(fastify) {
    fastify.get('/fortnite/api/matchmaking/session/findPlayer/:accountId', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", { preHandler: tokenVerify }, (request, reply) => {
        if (typeof request.query.bucketId != "string") return reply.status(400);
        if (request.query.bucketId.split(":").length != 4) return reply.status(400);
        const bucketId = request.query.bucketId;

        buildUniqueId[request.params.accountId] = bucketId.split(":")[0];
        const playlist = bucketId.split(":")[3];
        const playlists = require("../../gameserverConfig.json");
        let playerJoinToken;
        if (playlists[playlist]) {
            playerJoinToken = jwt.sign({
                gameserverIP: playlists[playlist].gameserverIP,
                gameserverPort: playlists[playlist].gameserverPort
            }, process.env.JWT_SECRET, { expiresIn: "1h" })

            playerMode.push(`${request.user.account_id}:${playerJoinToken}`);
        } else {
            playerJoinToken = jwt.sign({
                gameserverIP: playlists.playlist_defaultsolo.gameserverIP,
                gameserverPort: playlists.playlist_defaultsolo.gameserverPort
            }, process.env.JWT_SECRET, { expiresIn: "1h" })
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
        for (let i = 0; i < playerMode.length; i++) {
            if (playerMode[i].includes(accountId)) {
                playerJoinToken = playerMode[i].split(":")[1];
                playerMode.splice(i, 1);
                break;
            }
        }
        if (!playerJoinToken) {
            return reply.status(404).send();
        }
        const decodedToken = jwt.verify(playerJoinToken, process.env.JWT_SECRET);
        if (!decodedToken.gameserverIP || !decodedToken.gameserverPort) {
            return reply.status(404).send()
        }
        
        reply.status(200).send({
            "id": request.params.sessionId,
            "ownerId": uuidv4().replace(/-/ig, "").toUpperCase(),
            "ownerName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverAddress": decodedToken.gameserverIP,
            "serverPort": decodedToken.gameserverPort,
            "maxPublicPlayers": 220,
            "openPublicPlayers": 175,
            "maxPrivatePlayers": 0,
            "openPrivatePlayers": 0,
            "attributes": {
                "REGION_s": "EU",
                "GAMEMODE_s": "FORTATHENA",
                "ALLOWBROADCASTING_b": true,
                "SUBREGION_s": "GB",
                "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                "tenant_s": "Fortnite",
                "MATCHMAKINGPOOL_s": "Any",
                "STORMSHIELDDEFENSETYPE_i": 0,
                "HOTFIXVERSION_i": 0,
                "PLAYLISTNAME_s": "Playlist_DefaultSolo",
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

    fastify.post("/fortnite/api/matchmaking/session/:sessionId/join", (request, reply) => {
        reply.status(204).send();
    });

    fastify.post("/fortnite/api/matchmaking/session/matchmakingrequest", (request, reply) => {
        reply.status(200).send([]);
    });
}

module.exports = matchmaking;