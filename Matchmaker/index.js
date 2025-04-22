require("dotenv").config();
const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const base64url = require('base64url');

const logger = require("../utils/logger");
const functions = require("../utils/functions");
const playlists = require("../gameserverConfig.json");

global.queuedPlayers = {};
global.matchmakingTickets = {};

const wss = new WebSocket({ port: Number(process.env.MATCHMAKER_URL.split(":")[1]) });

wss.on('listening', () => {
    logger.matchmaker(`Matchmaker started listening on port ${process.env.MATCHMAKER_URL.split(":")[1]}`);
});

wss.on('connection', async (ws, req) => {
    ws.queued = false;
    const playlists = global.activeServers;
    try {
        const payload = (req.headers["authorization"].split(" ",)[2]).split(" ")[0];
    } catch {
        return Error(ws);
    }
    const payload = (req.headers["authorization"].split(" ",)[2]).split(" ")[0];
    const decodedPayload = jwt.verify(payload, process.env.JWT_SECRET);

    const accountId = decodedPayload.playerId;
    ws.region = decodedPayload.attributes["player.mms.region"];
    ws.playlist = decodedPayload.attributes["player.option.linkCode"];

    ws.ticketId = uuidv4().replace(/-/ig, "");
    const matchId = uuidv4().replace(/-/ig, "");
    const sessionId = uuidv4().replace(/-/ig, "");

    global.matchmakingTickets[accountId] = {
        ticketId: ws.ticketId,
        matchId: matchId,
        sessionId: sessionId,
        assignedServer: {
            "gameserverIP": "127.0.0.1",
            "gameserverPort": 7777,
            "PLAYLISTNAME_s": "Playlist_DefaultSolo",
            "REGION_s": ws.region,
            "serverName": "[DS]fortnite-liveplaylist-defaultsolo-eu-1"
        },
        timestamp: Date.now()
    }

    Connecting();
    await functions.sleep(150);
    QueueFull();
    while (getQueuedPlayers(ws.playlist, ws.region) >= Number(process.env.MAXIMUM_QUEUED_PLAYERS) && ws.readyState === ws.OPEN) {
        await functions.sleep(500);
    }
    await functions.sleep(1000);
    Waiting();
    await functions.sleep(350);
    Queued();
    ws.queued = true;
    UpdateQueuedState(ws.playlist, ws.region);
    await functions.sleep(200);
    while (getQueuedPlayers(ws.playlist, ws.region) < Number(process.env.MINIMUM_QUEUED_PLAYERS) && ws.readyState === ws.OPEN) {
        UpdateQueuedState(ws.playlist, ws.region);

        await functions.sleep(1500);
    }
    await functions.sleep(1500);
    SessionAssignment();
    if (process.env.QUEUED_MM_ENABLED == "true") {
        while (!playlists[ws.region] || !playlists[ws.region][ws.playlist] || !playlists[ws.region][ws.playlist][0] && ws.readyState === ws.OPEN) {
            await functions.sleep(1000);
        }
        global.matchmakingTickets[accountId].assignedServer = playlists[ws.region][ws.playlist][0];
    }
    await functions.sleep(200);
    ws.queued = false;
    Join();
    try {
        global.activeServers[ws.region][ws.playlist].splice(decodedPayload.serverIndex, 1);
    } catch (err) {
        return Error(ws);
    }

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        try {
            ws.send(JSON.stringify({
                "payload": {
                    "totalPlayers": 1,
                    "connectedPlayers": 1,
                    "state": "Waiting"
                },
                "name": "StatusUpdate"
            }));
        } catch (err) {
            console.log(err);
            ws.send(JSON.stringify({
                "payload": {
                    "totalPlayers": 0,
                    "connectedPlayers": 0,
                    "state": "Waiting"
                },
                "name": "StatusUpdate"
            }));
        }
    }

    function QueueFull() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "QueueFull"
            },
            "name": "StatusUpdate"
        }))
    }

    function Queued() {
        try {
            ws.send(JSON.stringify({
                "payload": {
                    "ticketId": ws.ticketId,
                    "queuedPlayers": getQueuedPlayers(ws.playlist, ws.region) || 0,
                    "estimatedWaitSec": 5,
                    "status": {
                        "ticket.status.creative.islandCode": ws.playlist
                    },
                    "state": "Queued"
                },
                "name": "StatusUpdate"
            }));
        } catch (err) {
            console.log(err);
            ws.send(JSON.stringify({
                "payload": {
                    "ticketId": ws.ticketId,
                    "queuedPlayers": 0,
                    "estimatedWaitSec": 5,
                    "status": {},
                    "state": "Queued"
                },
                "name": "StatusUpdate"
            }));
        }
    }

    function SessionAssignment() {
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "state": "SessionAssignment"
            },
            "name": "StatusUpdate"
        }));
    }

    function Join() {
        completedMatchmaking = true;
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "playerId": accountId,
                "joinDelaySec": 3,
                "payloadJwt": payload
            },
            "name": "Play"
        }));
    }

    ws.on("message", (message) => {
        if (Buffer.isBuffer(message)) message = message.toString();
        console.log(message);
    })

    ws.on("close", () => {
        UpdateQueuedState(ws.playlist, ws.region);
    })

    ws.on("error", () => {
        UpdateQueuedState(ws.playlist, ws.region);
    })
})

function Error(ws) {
    ws.send(XMLBuilder.create("close").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing").toString());
    ws.close();
}

function UpdateMatchmakingState(wss, message) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}

function getQueuedPlayers(playlist, region) {
    let queuedPlayers = 0;
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN && client.queued === true && client.playlist == playlist && client.region == region) {
            queuedPlayers = queuedPlayers + 1;
        }
    });

    return queuedPlayers;
}

function UpdateQueuedState(playlist, region) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN && client.queued === true && client.playlist == playlist && client.region == region) {
            client.send(JSON.stringify({
                "payload": {
                    "ticketId": client.ticketId,
                    "queuedPlayers": getQueuedPlayers(playlist, region) || 0,
                    "estimatedWaitSec": 5,
                    "status": {
                        "ticket.status.creative.islandCode": client.playlist
                    },
                    "state": "Queued"
                },
                "name": "StatusUpdate"
            }));
        }
    });
}

function setQueuedPlayers(region, playlist, increment) {
    if (!global.queuedPlayers[region]) {
        global.queuedPlayers[region] = {};
    }

    if (!global.queuedPlayers[region][playlist]) {
        global.queuedPlayers[region][playlist] = 0;
    }

    if (increment) {
        global.queuedPlayers[region][playlist]++;
    } else {
        global.queuedPlayers[region][playlist] = Math.max(0, global.queuedPlayers[region][playlist] - 1);
    }
}

function getMostQueuedPlaylist(region) {
    const playlistCounts = {};

    wss.clients.forEach(client => {
        if (
            client.readyState === client.OPEN &&
            client.queued === true &&
            client.region === region
        ) {
            if (!playlistCounts[client.playlist]) {
                playlistCounts[client.playlist] = 0;
            }
            playlistCounts[client.playlist]++;
        }
    });

    let maxPlaylist = null;
    let maxCount = -1;

    for (const [playlist, count] of Object.entries(playlistCounts)) {
        if (count > maxCount) {
            maxCount = count;
            maxPlaylist = playlist;
        }
    }

    return maxPlaylist || "none";
}

module.exports = {
    getMostQueuedPlaylist
}