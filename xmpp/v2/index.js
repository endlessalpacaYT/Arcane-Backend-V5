require("dotenv").config();
const WebSocket = require("ws").Server;
const XMLBuilder = require("xmlbuilder");
const XMLParser = require("xml-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();

const logger = require("../../utils/logger.js");
const functions = require("../../utils/functions.js");

const User = require("../../database/models/user.js");
const Friends = require("../../database/models/friends.js");

const port = Number(process.env.XMPP_PORT) || 8080;
const wss = new WebSocket({ server: app.listen(port) });
const matchmaker = require("./matchmaker/index.js");

global.xmppDomain = "prod.ol.epicgames.com";
global.Clients = [];
global.MUCs = {};

app.get("/", (req, res) => {
    res.type("application/json");

    let data = JSON.stringify({
        "Clients": {
            "amount": global.Clients.length,
            "clients": global.Clients.map(i => i.displayName)
        }
    }, null, 2);

    res.send(data);
});

app.get("/clients", (req, res) => {
    res.type("application/json");

    let data = JSON.stringify({
        "amount": global.Clients.length,
        "clients": global.Clients.map(i => i.displayName)
    }, null, 2);

    res.send(data);
});

wss.on('listening', () => {
    logger.xmpp(`XMPP and Matchmaker started listening on port ${port}`);
});

wss.on('connection', async (ws) => {
    ws.on('error', () => { });


    console.log(ws.protocol);
    if (ws.protocol.toLowerCase() != "xmpp") return matchmaker(ws);
    let joinedMUCs = [];
    let accountId = "";
    let displayName = "";
    let token = "";
    let jid = "";
    let resource = "";
    let ID = "";
    let Authenticated = false;
    let clientExists = false;
    let connectionClosed = false;

    ws.on('message', async (message) => {
        if (Buffer.isBuffer(message)) message = message.toString();
        const msg = XMLParser(message);
        if (!msg || !msg.root || !msg.root.name) return Error(ws);
        if (msg.root.name == "open") {
            if (!ID) ID = uuidv4();

            ws.send(XMLBuilder.create("open")
                .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
                .attribute("from", global.xmppDomain)
                .attribute("id", ID)
                .attribute("version", "1.0")
                .attribute("xml:lang", "en").toString());

            if (Authenticated) {
                ws.send(XMLBuilder.create("stream:features").attribute("xmlns:stream", "http://etherx.jabber.org/streams")
                    .element("ver").attribute("xmlns", "urn:xmpp:features:rosterver").up()
                    .element("starttls").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls").up()
                    .element("bind").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind").up()
                    .element("compression").attribute("xmlns", "http://jabber.org/features/compress")
                    .element("method", "zlib").up().up()
                    .element("session").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-session").up().toString());
            } else {
                ws.send(XMLBuilder.create("stream:features").attribute("xmlns:stream", "http://etherx.jabber.org/streams")
                    .element("mechanisms").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                    .element("mechanism", "PLAIN").up().up()
                    .element("ver").attribute("xmlns", "urn:xmpp:features:rosterver").up()
                    .element("starttls").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls").up()
                    .element("compression").attribute("xmlns", "http://jabber.org/features/compress")
                    .element("method", "zlib").up().up()
                    .element("auth").attribute("xmlns", "http://jabber.org/features/iq-auth").up().toString());
            }
        } else if (msg.root.name == "auth") {
            if (accountId) return;
            if (!msg.root.content) return Error(ws);
            let decoded;
            if (!DecodeBase64(msg.root.content).includes("\u0000")) {
                token = msg.root.content.replace("eg1~", "");
                decoded = jwt.verify(token, process.env.JWT_SECRET)
            } else {
                let decodedBase64 = DecodeBase64(msg.root.content).split("\u0000");

                if (decodedBase64.length < 3) return Error(ws);
                token = decodedBase64[2].replace("eg1~", "");

                decoded = jwt.verify(token, process.env.JWT_SECRET)
            }
            accountId = decoded.account_id;

            if (!accountId) return Error(ws);

            if (global.Clients.find(i => i.accountId === accountId)) return Error(ws);

            const user = await User.findOne({ 'accountInfo.id': accountId }).lean();
            if (!user) return Error(ws);

            displayName = user.accountInfo.displayName;

            if (accountId && displayName && token) {
                Authenticated = true;
                logger.xmpp(`An xmpp client with the displayName ${displayName} has logged in.`);

                ws.send(XMLBuilder.create("success").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl").toString());
            } else return Error(ws);
        } else {
            logger.xmpp(`Missing: ${msg.root.name}`);
            if (!ID) ID = uuidv4();

            ws.send(XMLBuilder.create("open")
                .attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-framing")
                .attribute("from", global.xmppDomain)
                .attribute("id", ID)
                .attribute("version", "1.0")
                .attribute("xml:lang", "en").toString());

            if (Authenticated) {
                ws.send(XMLBuilder.create("stream:features").attribute("xmlns:stream", "http://etherx.jabber.org/streams")
                    .element("ver").attribute("xmlns", "urn:xmpp:features:rosterver").up()
                    .element("starttls").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls").up()
                    .element("bind").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-bind").up()
                    .element("compression").attribute("xmlns", "http://jabber.org/features/compress")
                    .element("method", "zlib").up().up()
                    .element("session").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-session").up().toString());
            } else {
                ws.send(XMLBuilder.create("stream:features").attribute("xmlns:stream", "http://etherx.jabber.org/streams")
                    .element("mechanisms").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-sasl")
                    .element("mechanism", "PLAIN").up().up()
                    .element("ver").attribute("xmlns", "urn:xmpp:features:rosterver").up()
                    .element("starttls").attribute("xmlns", "urn:ietf:params:xml:ns:xmpp-tls").up()
                    .element("compression").attribute("xmlns", "http://jabber.org/features/compress")
                    .element("method", "zlib").up().up()
                    .element("auth").attribute("xmlns", "http://jabber.org/features/iq-auth").up().toString());
            }
        }
    });
});