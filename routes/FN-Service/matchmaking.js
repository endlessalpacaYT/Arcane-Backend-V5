require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { GetServer, IsValidServer } = require("../../utils/matchmaking-helper.js");
const { getCookie, setCookie } = require("@fastify/cookie"); // cookie cookie cookie, its crumble cookie, crumble cookie for life! crumble cookie!

async function matchmaking(fastify) {
    fastify.get("/fortnite/api/matchmaking/session/findPlayer/*", async (request, reply) => {
        reply.status(200);
    });

    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", (request, reply) => {
        const accountId = request.params.accountId;
        const bucketId = request.query.bucketId;
        if (!bucketId || bucketId.split(":").length !== 4) {
          return reply.code(400).send("Invalid bucketId");
        }
    
        const [buildUniqueId, , currentRegion, currentPlaylist] = bucketId.split(":");
        if (!IsValidServer(currentPlaylist, currentRegion)) {
          return reply.code(400).send({});
        }
    
        setCookie(reply, "currentbuildUniqueId", buildUniqueId);
        setCookie(reply, "region", currentRegion);
        setCookie(reply, "playlist", currentPlaylist);
        setCookie(reply, "accountId", accountId);
        
        reply.status(200).send({
            "serviceUrl": `ws://${process.env.MATCHMAKER_URL}`,
            "ticketType": "mms-player",
            "payload": "acc",
            "signature": "jengle="
        });
    });

    fastify.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", (request, reply) => {
        reply.status(200).send({
            "accountId": request.params.accountId,
            "sessionId": request.params.sessionId,
            "key": "AOJEv8uTFmUh7XM2328kq9rlAzeQ5xzWzPIiyKn2s7s="
        });
    });

    fastify.get("/fortnite/api/matchmaking/session/:sessionId", (request, reply) => {
        const sessionId = request.params.sessionId;
        const playlist = getCookie(req, "playlist");
        const region = getCookie(req, "region");
        const currentbuildUniqueId = getCookie(req, "currentbuildUniqueId");
        const server = GetServer(playlist, region);
        reply.status(200).send({
            "id": sessionId,
            "ownerId": uuidv4().replace(/-/gi, "").toUpperCase(),
            "ownerName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverName": "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            "serverAddress": server?.IP,
            "serverPort": server?.Port.toString(),
            "maxPublicPlayers": 220,
            "openPublicPlayers": 175,
            "maxPrivatePlayers": 0,
            "openPrivatePlayers": 0,
            "attributes": {
                "REGION_s": region,
                "GAMEMODE_s": "FORTATHENA",
                "ALLOWBROADCASTING_b": true,
                "SUBREGION_s": "GB",
                "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                "tenant_s": "Fortnite",
                "MATCHMAKINGPOOL_s": "Any",
                "STORMSHIELDDEFENSETYPE_i": 0,
                "HOTFIXVERSION_i": 0,
                "PLAYLISTNAME_s": playlist,
                "SESSIONKEY_s": uuidv4().replace(/-/gi, "").toUpperCase(),
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
            "buildUniqueId": currentbuildUniqueId,
            "lastUpdated": new Date().toISOString(),
            "started": false
        });
    });

    fastify.post("/fortnite/api/matchmaking/session/:sessionId/join", (request, reply) => {
        reply.status(204);
    });

    fastify.post("/fortnite/api/matchmaking/session/matchMakingRequest", (request, reply) => {
        reply.status(200).send([]);
    });
}

module.exports = matchmaking;