require("dotenv").config();
const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const functions = require("../../../utils/functions");

let queuedPlayers = 0;

function Error(ws) {
    ws.send(XMLBuilder.create("close").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing").toString());
    ws.close();
}

module.exports = async (ws, accountId) => {
    const ticketId = uuidv4().replace(/-/ig, "");
    const matchId = uuidv4().replace(/-/ig, "");
    const sessionId = uuidv4().replace(/-/ig, "");

    let completedMatchmaking = false;

    if (!accountId) { console.warn("No accountId sent to matchmaker!"); return Error(ws) }
    let playerJoinToken;
    for (let i = 0; i < global.playerMode.length; i++) {
        if (global.playerMode[i].includes(accountId)) {
            global.playerMode[i] = `${global.playerMode[i]}:${sessionId}`
            playerJoinToken = global.playerMode[i].split(":")[1];
            break;
        }
    }
    if (!playerJoinToken) {
        return Error(ws)
    }
    const decodedToken = jwt.verify(playerJoinToken, process.env.JWT_SECRET);
    if (!decodedToken.serverName) {
        return Error(ws)
    }

    Connecting();
    await functions.sleep(1000);
    Waiting();
    await functions.sleep((queuedPlayers * 5 + queuedPlayers) * 1000);
    Queued();
    if (process.env.QUEUED_MM_ENABLED == "true") {
        let serverOnline = false;
        while (!serverOnline) {
            for (let i = 0; i < global.serverOnline.length; i++) {
                if (global.serverOnline[i] == decodedToken.serverName) {
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
    global.serverOnline.splice(global.serverOnline.findIndex(i => i.serverName == decodedToken.serverName), 1);

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

    ws.on("close", () => {
        if (!completedMatchmaking) {
            global.playerMode.splice(global.playerMode.findIndex(i => i.includes(accountId)));
        }
    })
}