require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const base64url = require('base64url');

const functions = require("../../utils/functions");

const tokenVerify = require("../../middlewares/tokenVerify");
const { createError } = require("../../utils/error");

let buildUniqueId = {};
global.playerMode = {};

async function matchmaking(fastify) {
    fastify.get('/fortnite/api/matchmaking/session/findPlayer/:accountId', (request, reply) => {
        reply.status(200).send();
    })

    fastify.post('/fortnite/api/matchmaking/session/matchMakingRequest', (request, reply) => {
        reply.status(200).send([
            {
                "id": uuidv4().replace(/-/ig, "").toUpperCase(),
                "ownerId": uuidv4().replace(/-/ig, "").toUpperCase(),
                "ownerName": "[DS]fortnite-live-main-stw-eu-gb-az-uksouth-standardd16sv5-66060",
                "serverName": "[DS]fortnite-live-main-stw-eu-gb-az-uksouth-standardd16sv5-66060",
                "serverAddress": "127.0.0.1",
                "serverPort": 7777,
                "maxPublicPlayers": 4,
                "openPublicPlayers": 3,
                "maxPrivatePlayers": 0,
                "openPrivatePlayers": 0,
                "attributes": {
                    "THEATERID_s": "33A2311D4AE64B361CCE27BC9F313C8B",
                    "ZONEINSTANCEID_s": "{\"worldId\":\"\",\"theaterId\":\"33A2311D4AE64B361CCE27BC9F313C8B\",\"theaterMissionId\":\"cdea3678-4164-4831-84d0-191e3838da45\",\"theaterMissionAlertId\":\"1c450c3c-896c-43d3-85ab-963ebf9542b6\",\"zoneThemeClass\":\"/STW_Zones/World/ZoneThemes/ZT_TheSuburbs/BP_ZT_TheSuburbs.BP_ZT_TheSuburbs_C\"}",
                    "maxPrivatePlayers_s": "0",
                    "CHECKSANCTIONS_s": "false",
                    "STORMSHIELDDEFENSETYPE_i": 0,
                    "DEPLOYMENT_s": "Fortnite",
                    "allowJoinViaPresenceFriendsOnly_s": "false",
                    "DCID_s": "FORTNITE-LIVE-MAIN-STW-EU-GB-AZ-UKSOUTH-STANDARDD16SV5-40606470",
                    "SERVERADDRESS_s": "127.0.0.1",
                    "NETWORKMODULE_b": false,
                    "HOTFIXVERSION_i": 1,
                    "serverPort_s": "7777",
                    "MINDIFFICULTY_i": 1200,
                    "SUBREGION_s": "GB",
                    "MATCHMAKINGPOOL_s": "Any",
                    "PARTITION_i": 4,
                    "usesStats_s": "false",
                    "serverAddress_s": "127.0.0.1",
                    "PLAYLISTID_i": 0,
                    "serverName_s": "[DS]fortnite-live-main-stw-eu-gb-az-uksouth-standardd16sv5-66060",
                    "GAMEMODE_s": "FORTPVE",
                    "MMLVL_i": 142,
                    "historicalPlayers_s": "[]",
                    "buildUniqueId_s": "40085714",
                    "GATHERABLE_b": true,
                    "sortWeight_s": "0",
                    "ALLOWMIGRATION_s": "false",
                    "REJOINAFTERKICK_s": "OPEN",
                    "NEEDSSORT_i": 3,
                    "allowJoinInProgress_s": "true",
                    "privatePlayers_s": "[]",
                    "BEACONPORT_i": 15024,
                    "usesPresence_s": "false",
                    "BUCKET_s": "EU:FORTNITE-LIVE-MAIN-STW-EU-GB-AZ-UKSOUTH-STANDARDD16SV5-40606470:40085714:Fortnite",
                    "MAXDIFFICULTY_i": 1300,
                    "maxPublicPlayers_s": "4",
                    "invites_s": "[]",
                    "LASTUPDATED_s": new Date().toISOString(),
                    "ALLOWREADBYID_s": "false",
                    "isDedicated_s": "true",
                    "ownerName_s": "[DS]fortnite-live-main-stw-eu-gb-az-uksouth-standardd16sv5-66060",
                    "REGION_s": "EU",
                    "CRITICALMISSION_b": true,
                    "ADDRESS_s": "127.0.0.1",
                    "NEEDS_i": 3,
                    "MAXDIFFICULTYSORT_i": 1300,
                    "openPrivatePlayers_s": "0",
                    "DISALLOWQUICKPLAY_b": false,
                    "lastUpdated_s": new Date().toISOString(),
                    "DOMAINNAME_s": "fortnite.ds.epicgames.com"
                },
                "publicPlayers": [],
                "privatePlayers": [],
                "totalPlayers": 1,
                "allowJoinInProgress": true,
                "shouldAdvertise": true,
                "isDedicated": true,
                "usesStats": false,
                "allowInvites": true,
                "usesPresence": false,
                "allowJoinViaPresence": true,
                "allowJoinViaPresenceFriendsOnly": false,
                "buildUniqueId": "40085714",
                "lastUpdated": new Date().toISOString(),
                "started": true
            }
        ]);
    })

    /*fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", (request, reply) => {
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
    });*/

    fastify.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", (request, reply) => {
        if (typeof request.query.bucketId != "string") return reply.status(400);
        if (request.query.bucketId.split(":").length != 4) return reply.status(400);
        const bucketId = request.query.bucketId;
        const memory = functions.GetVersionInfo(request);

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

                global.playerMode[request.params.accountId] = {
                    token: playerJoinToken
                };
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

        const payload = { // thanks chronos for the payload, i made changes
            playerId: request.params.accountId,
            partyPlayerId: request.query.partyPlayerIds,
            bucketId: bucketId,
            attributes: {
                "player.mms.region": region,
                "player.userAgent": memory.agent,
                "player.preferredSubregion": request.query["player.subregions"]?.split(",")[0],
                "player.option.spectator": "false",
                "player.inputTypes": request.query["player.inputTypes"],
                "player.revision": request.query["player.revision"],
                "player.teamFormat": "fun",
                "player.subregions": request.query["player.subregions"],
                "player.season": memory.season,
                "player.platform": request.query["player.platform"],
                "player.option.linkCode": request.query["player.option.linkCode"]?.toLowerCase() || playlist,
                "player.option.linkType": "DEFAULT",
                "player.input": request.query["player.input"],
                "playlist.revision": request.query["playlist.revision"],
                "player.option.fillTeam": request.query["player.option.fillTeam"],
                "player.option.uiLanguage": "en",
                "player.option.microphoneEnabled": request.query["player.option.microphoneEnabled"],
                "player.option.partyId": request.query["player.option.partyId"]
            },
            expiresAt: new Date(new Date().getTime() + 32 * 60 * 60 * 1000).toISOString(),
            nonce: uuidv4().replace(/-/, ""),
        };

        return reply.status(200).send({
            "serviceUrl": `ws://${process.env.MATCHMAKER_URL}`,
            "ticketType": "mms-player",
            "payload": jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" }), // jwt sign the payload because epic games does it
            "signature": "420="
        });
    })

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
        if (global.playerMode[accountId]) {
            playerJoinToken = global.playerMode[accountId].token;
        } else return reply.status(404).send();
        const decodedToken = jwt.verify(playerJoinToken, process.env.JWT_SECRET);

        return reply.status(200).send({
            "id": request.params.sessionId,
            "ownerId": uuidv4().replace(/-/ig, "").toUpperCase(),
            "ownerName": decodedToken.serverName,
            "serverName": decodedToken.serverName,
            "serverAddress": decodedToken.serverAddress,
            "serverPort": decodedToken.serverPort,
            "maxPublicPlayers": 128,
            "openPublicPlayers": 103,
            "maxPrivatePlayers": 0,
            "openPrivatePlayers": 0,
            "attributes": {
                "ALLOWMIGRATION_s": "false",
                "REJOINAFTERKICK_s": "OPEN",
                "CHECKSANCTIONS_s": "false",
                "STORMSHIELDDEFENSETYPE_i": 0,
                "BEACONPORT_i": 15058,
                "BUCKET_s": "",
                "DEPLOYMENT_s": "Fortnite",
                "LASTUPDATED_s": new Date().toISOString(),
                "PLAYLISTNAME_s": decodedToken.PLAYLISTNAME_s,
                "LINKID_s": `${decodedToken.PLAYLISTNAME_s.toLowerCase()}?v=95`,
                "DCID_s": "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                "allowMigration_s": false,
                "ALLOWREADBYID_s": "false",
                "SERVERADDRESS_s": decodedToken.serverAddress,
                "ALLOWBROADCASTING_b": true,
                "NETWORKMODULE_b": true,
                "HOTFIXVERSION_i": 1,
                "lastUpdated_s": new Date().toISOString(),
                "SUBREGION_s": decodedToken.REGION_s,
                "MATCHMAKINGPOOL_s": "Any",
                "allowReadById_s": false,
                "SESSIONKEY_s": uuidv4().replace(/-/ig, "").toUpperCase(),
                "REGION_s": decodedToken.REGION_s,
                "serverAddress_s": decodedToken.serverAddress,
                "LINKTYPE_s": "BR:Playlist",
                "GAMEMODE_s": "FORTATHENA",
                "deployment_s": "Fortnite",
                "ADDRESS_s": decodedToken.serverAddress,
                "bucket_s": "",
                "checkSanctions_s": false,
                "rejoinAfterKick_s": "OPEN"
            },
            "publicPlayers": [],
            "privatePlayers": [],
            "totalPlayers": 25,
            "allowJoinInProgress": false,
            "shouldAdvertise": false,
            "isDedicated": true,
            "usesStats": false,
            "allowInvites": false,
            "usesPresence": false,
            "allowJoinViaPresence": true,
            "allowJoinViaPresenceFriendsOnly": false,
            "buildUniqueId": buildUniqueId[request.user.account_id] || "0",
            "lastUpdated": new Date().toISOString(),
            "started": false
        })
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