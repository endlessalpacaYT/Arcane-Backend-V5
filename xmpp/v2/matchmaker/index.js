const { v4: uuidv4 } = require("uuid");

const functions = require("../../../utils/functions");

module.exports = async (ws) => {
    Connecting();

    function Connecting() {
        ws.send(JSON.stringify({
            "payload": {
                "state": "Connecting"
            },
            "name": "StatusUpdate"
        }));
    }
}