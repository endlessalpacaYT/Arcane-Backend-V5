const { v4: uuidv4 } = require("uuid");

const functions = require("../../../utils/functions");

let queuedPlayers = 0;

module.exports = async (ws) => {
    const ticketId = uuidv4().replace(/-/ig, "");
    const matchId = uuidv4().replace(/-/ig, "");
    const sessionId = uuidv4().replace(/-/ig, "");

    Connecting();
    await functions.sleep(1000);
    Waiting();
    await functions.sleep((queuedPlayers * 5 + queuedPlayers) * 1000);
    Queued();
    if (process.env.QUEUED_MM_ENABLED == "true") {
        while (!global.serverOnline) {
            await functions.sleep(2000);
        }
    } else {
        await functions.sleep(8000);
    }
    SessionAssignment();
    await functions.sleep(2000);
    Join();
    await functions.sleep(10000);
    global.serverOnline = false;

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
        ws.send(JSON.stringify({
            "payload": {
                "matchId": matchId,
                "sessionId": sessionId,
                "joinDelaySec": 1
            },
            "name": "Play"
        }));
    }
}