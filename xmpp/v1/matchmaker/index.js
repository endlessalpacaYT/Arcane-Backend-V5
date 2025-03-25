require("dotenv").config();
const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const base64url = require('base64url');

const functions = require("../../../utils/functions");
const playlists = require("../../../gameserverConfig.json");

let queuedPlayers = 0;

function Error(ws) {
    ws.send(XMLBuilder.create("close").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing").toString());
    ws.close();
}

module.exports = async (ws, req) => {
    const payload = (req.headers["authorization"].split(" ",)[2]).split(" ")[0];
    const decodedPayload = jwt.verify(payload, process.env.JWT_SECRET);

    const region = decodedPayload.attributes["player.mms.region"];
    const playlist = decodedPayload.attributes["player.option.linkCode"];
    let gameserver;
    try {
        if (playlists[region] || playlists[region][playlist]) {
            gameserver = functions.getRandomElement(playlists[region][playlist]);
        } else {
            return Error(ws);
        }
    } catch {
        return Error(ws);
    }

    const ticketId = uuidv4().replace(/-/ig, "");
    const matchId = uuidv4().replace(/-/ig, "");
    const sessionId = base64url.encode(`${region}:${playlist}`);
    /*const sessionId = base64url.encode(jwt.sign({
        serverAddress: gameserver.gameserverIP,
        serverPort: gameserver.gameserverPort,
        PLAYLISTNAME_s: gameserver.PLAYLISTNAME_s,
        REGION_s: region,
        serverName: gameserver.serverName
    }, process.env.JWT_SECRET));
    console.log(sessionId)*/

    Connecting();
    await functions.sleep(1000);
    Waiting();
    await functions.sleep((queuedPlayers * 5 + queuedPlayers) * 1000);
    Queued();
    if (process.env.QUEUED_MM_ENABLED == "true") {
        let serverOnline = false;
        while (!serverOnline) {
            for (let i = 0; i < global.serverOnline.length; i++) {
                if (global.serverOnline[i] == gameserver.serverName) {
                    serverOnline = true;
                    break;
                }
            }
            await functions.sleep(2000);
        }
    } else {
        await functions.sleep(8000);
    }
    SessionAssignment();
    await functions.sleep(2000);
    Join();
    await functions.sleep(10000);
    global.serverOnline.splice(global.serverOnline.findIndex(i => i.serverName == gameserver.serverName), 1);

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }

    function Waiting() {
        queuedPlayers++;
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
        const estimatedWaitSec = queuedPlayers * 20 + queuedPlayers;
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
        queuedPlayers--;
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

    ws.on("close", () => { })
}