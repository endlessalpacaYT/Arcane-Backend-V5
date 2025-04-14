require("dotenv").config();
const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const base64url = require('base64url');

const functions = require("../../../utils/functions");

let queuedPlayers = 0;
let estimatedWaitSec = queuedPlayers * 50 + queuedPlayers;

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

function UpdateQueuedState(ws, message) {
    estimatedWaitSec = queuedPlayers * 50 + queuedPlayers;
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN && client.queued === true) {
            client.send(message);
        }
    });
}

module.exports = async (ws, req) => {
    ws.queued = false;
    queuedPlayers++;
    const playlists = global.activeServers;
    const payload = (req.headers["authorization"].split(" ",)[2]).split(" ")[0];
    const decodedPayload = jwt.verify(payload, process.env.JWT_SECRET);

    const accountId = decodedPayload.playerId;
    const region = decodedPayload.attributes["player.mms.region"];
    const playlist = decodedPayload.attributes["player.option.linkCode"];
    let gameserver;
    /*try {
        if (playlists[region] || playlists[region][playlist]) {
            gameserver = functions.getRandomElement(playlists[region][playlist]);
        } else {
            return Error(ws);
        }
    } catch {
        return Error(ws);
    }*/

    const ticketId = uuidv4().replace(/-/ig, "");
    const matchId = uuidv4().replace(/-/ig, "");
    const sessionId = uuidv4().replace(/-/ig, "");
    // const sessionId = base64url.encode(`${region}:${playlist}`);
    /*const sessionId = base64url.encode(jwt.sign({
        serverAddress: gameserver.gameserverIP,
        serverPort: gameserver.gameserverPort,
        PLAYLISTNAME_s: gameserver.PLAYLISTNAME_s,
        REGION_s: region,
        serverName: gameserver.serverName
    }, process.env.JWT_SECRET));
    console.log(sessionId)*/

    Connecting();
    await functions.sleep(200);
    Waiting();
    await functions.sleep(200);
    Queued();
    ws.queued = true;
    /*UpdateQueuedState(ws, JSON.stringify({
        "payload": {
            "ticketId": ticketId,
            "queuedPlayers": queuedPlayers,
            "estimatedWaitSec": estimatedWaitSec,
            "status": {},
            "state": "Queued"
        },
        "name": "StatusUpdate"
    }))*/
    while (!playlists[region] || !playlists[region][playlist] || !playlists[region][playlist]) {
        await functions.sleep(1000);
    }
    gameserver = {
        server: playlists[region][playlist][0],
        index: 0
    };

    const playerJoinToken = jwt.sign({
        serverAddress: gameserver.server.gameserverIP,
        serverPort: gameserver.server.gameserverPort,
        PLAYLISTNAME_s: gameserver.server.PLAYLISTNAME_s,
        REGION_s: region,
        serverName: gameserver.server.serverName
    }, process.env.JWT_SECRET, { expiresIn: "1h" })

    global.playerMode[accountId] = {
        token: playerJoinToken
    };
    await functions.sleep(200);
    SessionAssignment();
    ws.queued = false;
    await functions.sleep(200);
    Join();
    await functions.sleep(20000);
    global.activeServers[region][playlist].splice(decodedPayload.serverIndex, 1);

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        ws.send(JSON.stringify({
            "payload": {
                "totalPlayers": queuedPlayers,
                "connectedPlayers": queuedPlayers,
                "state": "Waiting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Queued() {
        ws.send(JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": queuedPlayers,
                "estimatedWaitSec": estimatedWaitSec,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }));
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
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }

    ws.on("close", (ws) => {
        queuedPlayers--;
        /*UpdateQueuedState(ws, JSON.stringify({
            "payload": {
                "ticketId": ticketId,
                "queuedPlayers": queuedPlayers,
                "estimatedWaitSec": estimatedWaitSec,
                "status": {},
                "state": "Queued"
            },
            "name": "StatusUpdate"
        }))*/
    })
}