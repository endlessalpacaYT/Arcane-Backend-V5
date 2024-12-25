require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

let buildUniqueId = {};

async function matchmaking(fastify) {
    fastify.get('/fortnite/api/matchmaking/session/findPlayer/:accountId', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", (request, reply) => {
        if (request.query.bucketId.split(":").length !== 4) return reply.code(400).send();
    
        const accountId = request.params.accountId;
        buildUniqueId[accountId] = request.query.bucketId.split(":")[0];
        
        reply.status(200).send({
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
            "key": "none"
        });
    });

    fastify.get("/fortnite/api/matchmaking/session/:sessionId", (request, reply) => {
        reply.status(200).send({
            "id": request.params.sessionId,
            "ownerId": uuidv4().replace(/-/ig, "").toUpperCase(),
            "ownerName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverAddress": process.env.GS_IP,
            "serverPort": process.env.GS_PORT,
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
            "buildUniqueId": buildUniqueId[request.params.sessionId] || "0",
            "lastUpdated": new Date().toISOString(),
            "started": false
        });
    });

    fastify.post("/fortnite/api/matchmaking/session/:sessionId/join", (request, reply) => {
        reply.status(204);
    });

    fastify.post("/fortnite/api/matchmaking/session/matchmakingrequest", (request, reply) => {
        reply.status(200).send([]);
    });
}

module.exports = matchmaking;
