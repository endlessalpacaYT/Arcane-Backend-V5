const { v4: uuidv4 } = require("uuid");
const { sleep } = require("../../utils/functions");
const logger = require("../../utils/logger.js");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { WebSocketServer } = require("ws");
const { MatchmakerPort, AllServers } = require("../../utils/matchmaking-helper.js");

let wait = false;
let queuedPlayers = 0;

const wss = new WebSocketServer({ port: MatchmakerPort });

wss.on("listening", () => {
    logger.mm(`Matchmaker started listening on port ${MatchmakerPort}`);
});

wss.on("connection", async (ws, req) => {
    if (ws.protocol.toLowerCase().includes("xmpp")) return ws.close();

    const headerAuth = req.headers["authorization"];
    if (!headerAuth) {
        return ws.close();
    }

    const ticketId = uuidv4().replace(/-/g, "");
    const matchId = uuidv4().replace(/-/g, "");
    const sessionId = uuidv4().replace(/-/g, "");

    Connecting();
    await sleep(1000);
    Waiting();
    await sleep((queuedPlayers * 5 + queuedPlayers) * 1000);
    Queued();
    await sleep(8000);
    SessionAssignment();
    await sleep(2000);
    Join();

    function Connecting() {
        ws.send(JSON.stringify({
            name: "StatusUpdate",
            payload: { state: "Connecting" }
        }));
    }

    function Waiting() {
        queuedPlayers++;
        ws.send(JSON.stringify({
            name: "StatusUpdate",
            payload: {
                totalPlayers: queuedPlayers,
                connectedPlayers: queuedPlayers,
                state: "Waiting"
            }
        }));
    }

    function Queued() {
        const estimatedWaitSec = queuedPlayers * 20 + queuedPlayers;
        ws.send(JSON.stringify({
            name: "StatusUpdate",
            payload: {
                ticketId,
                queuedPlayers,
                estimatedWaitSec,
                status: {},
                state: "Queued"
            }
        }));
    }

    function SessionAssignment() {
        queuedPlayers--;
        ws.send(JSON.stringify({
            name: "StatusUpdate",
            payload: {
                matchId,
                state: "SessionAssignment"
            }
        }));
    }

    function Join() {
        ws.send(JSON.stringify({
            name: "Play",
            payload: {
                matchId,
                sessionId,
                joinDelaySec: 1
            }
        }));
    }
});

function isValidServerId(serverId) {
    return AllServers.some(server => server.Name.startsWith(serverId));
}

app.post("/state", (req, res) => {
    const { serverId, key, state } = req.query;

    if (!serverId || !key || !state) {
        return res.status(400).send("Missing parameters");
    }

    if (!isValidServerId(serverId)) {
        return res.status(404).send("Invalid serverId.");
    }

    if (key !== process.env.JWT_SECRET) {
        return res.status(401).send("Unauthorized");
    }

    wait = state === "joinable";
    logger.mm(`${serverId} state updated to ${wait}`);

    res.status(200).send(`Server "${serverId}" state updated to "${state}".`);
});

app.get("/launcher/queued", (req, res) => {
    return res.json({ queued: queuedPlayers });
});

const PORT = process.env.API_PORT || 7777; // random port xdd
app.listen(PORT, () => {});