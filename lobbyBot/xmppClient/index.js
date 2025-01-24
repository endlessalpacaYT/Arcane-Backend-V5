require("dotenv").config();
const WebSocket = require('ws');
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");

const logger = require("../../utils/logger");

const wsServerUrl = `ws://${process.env.HOST}:8080`;

const ws = new WebSocket(wsServerUrl, "xmpp");

let partyId = "082E6BEE4A4EE2E19C838BB1416423DB"

ws.on('open', () => {
    logger.bot(`Bot Connected To: ${wsServerUrl}`);
    ws.send(XMLBuilder.create("open")
        .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
        .attribute("to", "prod.ol.epicgames.com")
        .attribute("version", "1.0")
        .end()
    )
});

const mockStatus = {
    Status: "Playing ArcaneV5!",
    bIsPlaying: false,
    bIsJoinable: true,
    bHasVoiceSupport: false,
    SessionId: "",
    Properties: {
        "party.joininfodata.286331153_j": {
            sourceId: uuidv4(),
            sourceDisplayName: process.env.DISPLAYNAME,
            sourceMcpDisplayName: process.env.DISPLAYNAME,
            sourcePlatform: "WIN",
            partyId: partyId,
            partyTypeId: 286331153,
            key: "85E938534BEEDBB844A484AF31848601",
            appId: "Fortnite",
            buildId: "4287428",
            partyFlags: 6,
            notAcceptingReason: 0
        },
        "FortBasicInfo_j": {
            homeBaseRating: 1
        },
        "FortLFG_I": "0",
        "FortPartySize_i": 1,
        "FortSubGame_i": 1,
        "InUnjoinableMatch_b": false
    }
};

ws.on('message', async (message) => {
    if (Buffer.isBuffer(message)) message = message.toString();
    const msg = XMLParser(message);
    //console.log(msg);
    if (msg.root.name == "open") {
        ws.send(XMLBuilder.create("auth")
            .attribute("mechanism", "PLAIN")
            .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
            .text(global.botToken)
            .end()
        )
    } else if (msg.root.name == "success") {
        ws.send(XMLBuilder.create("iq")
            .attribute("id", "_xmpp_bind1")
            .attribute("type", "set")
            .ele("bind", { xmlns: "urn:ietf:params:xml:ns:xmpp-bind" })
            .ele("resource")
            .txt("V2:Fortnite:WIN::708B5D6147AF15C2DF7F50B307B575FA")
            .up()
            .up()
            .end()
        )

        ws.send(XMLBuilder.create("iq")
            .attribute("id", "_xmpp_session1")
            .attribute("type", "set")
            .ele("session", { xmlns: "urn:ietf:params:xml:ns:xmpp-session" })
            .end()
        )

        ws.send(XMLBuilder.create("presence")
            .ele("status", JSON.stringify(mockStatus))
            .up()
            .ele("delay", { stamp: new Date().toISOString(), xmlns: "urn:xmpp:delay" })
            .end()
        )
    } else if (msg.root.name == "message") {
        console.log(msg.root.children);
        const parsedcontent = JSON.parse(msg.root.children[0].content)
        if (parsedcontent.type == "com.epicgames.party.invitation") {
            ws.send(XMLBuilder.create("message")
                .attribute("id", msg.root.attributes.id)
                .attribute("to", msg.root.attributes.from)
                .ele("body")
                .txt(JSON.stringify({
                    type: "com.epicgames.party.joinrequest",
                    payload: {
                        partyId: parsedcontent.payload.partyId,
                        displayName: process.env.DISPLAYNAME,
                        mcpdisplayName: process.env.DISPLAYNAME,
                        platform: "WIN",
                        accessKey: "85E938534BEEDBB844A484AF31848601",
                        appid: "Fortnite",
                        buildid: "4287428",
                        joinData: {
                            Rev: 0,
                            Attrs: {
                                CrossplayPreference_i: 1
                            }
                        }
                    },
                    timestamp: new Date().toISOString()
                }))
                .up()
                .end()
            )

            ws.send(XMLBuilder.create("message")
                .attribute("id", msg.root.attributes.id)
                .attribute("to", msg.root.attributes.from)
                .ele("body")
                .txt(JSON.stringify({
                    type: "com.epicgames.party.joinacknowledged",
                    payload: {
                        partyId: parsedcontent.payload.partyId
                    },
                    timestamp: new Date().toISOString()
                }))
                .up()
                .end()
            )
        }
    } else if (msg.root.name == "presence") {
        if (msg.root.type == "unavailable") {
            ws.send(XMLBuilder.create("presence")
                .ele("status", JSON.stringify(mockStatus))
                .up()
                .ele("delay", { stamp: new Date().toISOString(), xmlns: "urn:xmpp:delay" })
                .end()
            )
        }
    } else if (msg.root.name == "iq") {

    } else if (msg.root.name == "stream:features") {

    } else {
        console.log('Unrecognised Message:', msg);
    }
});

ws.on('error', (error) => {
    console.error('Bot XMPP Client Error:', error);
});