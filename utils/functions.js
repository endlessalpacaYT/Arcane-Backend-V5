const XMLBuilder = require("xmlbuilder");
const fs = require("fs");
const path = require("path");

/*
const axios = require("axios"); const url = "https://raw.githubusercontent.com/endlessalpacaYT/Arcane-Backend-V5/refs/heads/main/responses/fortniteConfig/content/fortnite-game.json";
async function replContentPages() { const resp = await axios.get(url); const data = resp.data; const conPath = path.join(__dirname, "..", "responses", "fortniteConfig", "content", "fortnite-game.json"); fs.writeFileSync(conPath, JSON.stringify(data, null, 2)); } replContentPages();
*/

function GetVersionInfo(request) {
    let memory = {
        agent: "",
        season: 0,
        build: 0.0,
        CL: "0",
        lobby: ""
    }

    if (request.headers["user-agent"]) {
        memory.agent = request.headers["user-agent"];
        let CL = "";

        try {
            let BuildID = request.headers["user-agent"].split("-")[3].split(",")[0];

            if (!Number.isNaN(Number(BuildID))) CL = BuildID;
            else {
                BuildID = request.headers["user-agent"].split("-")[3].split(" ")[0];

                if (!Number.isNaN(Number(BuildID))) CL = BuildID;
            }
        } catch {
            try {
                let BuildID = request.headers["user-agent"].split("-")[1].split("+")[0];

                if (!Number.isNaN(Number(BuildID))) CL = BuildID;
            } catch { }
        }

        try {
            let Build = request.headers["user-agent"].split("Release-")[1].split("-")[0];

            if (Build.split(".").length == 3) {
                let Value = Build.split(".");
                Build = Value[0] + "." + Value[1] + Value[2];
            }

            memory.season = Number(Build.split(".")[0]);
            memory.build = Number(Build);
            memory.CL = CL;
            memory.lobby = `LobbySeason${memory.season}`;

            if (Number.isNaN(memory.season)) throw new Error();
        } catch {
            if (Number(memory.CL) < 3724489) {
                memory.season = 0;
                memory.build = 0.0;
                memory.CL = CL;
                memory.lobby = "LobbySeason0";
            } else if (Number(memory.CL) <= 3790078) {
                memory.season = 1;
                memory.build = 1.0;
                memory.CL = CL;
                memory.lobby = "LobbySeason1";
            } else {
                memory.season = 2;
                memory.build = 2.0;
                memory.CL = CL;
                memory.lobby = "LobbyWinterDecor";
            }
        }
    }

    return memory;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomElementAndIndex(array) {
    const index = Math.floor(Math.random() * array.length);
    return {
        array: array[index],
        index: index
    };
}

function getRandomNumber() {
    return Math.floor(Math.random() * 6);
}

async function sleep(ms) {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

function sendXmppMessageToAll(body) {
    try {
        if (!global.Clients) return;
        if (typeof body == "object") body = JSON.stringify(body);

        global.Clients.forEach(ClientData => {
            ClientData.client.send(XMLBuilder.create("message")
                .attribute("from", `xmpp-admin@${global.xmppDomain}`)
                .attribute("xmlns", "jabber:client")
                .attribute("to", ClientData.jid)
                .element("body", `${body}`).up().toString());
        });
    } catch (err) {
        console.log(err);
    }
}

function sendXmppMessageToId(body, toAccountId) {
    try {
        if (!global.Clients) return;
        if (typeof body == "object") body = JSON.stringify(body);

        let receiver = global.Clients.find(i => i.accountId == toAccountId);
        if (!receiver) return;

        receiver.client.send(XMLBuilder.create("message")
            .attribute("from", `xmpp-admin@${global.xmppDomain}`)
            .attribute("to", receiver.jid)
            .attribute("xmlns", "jabber:client")
            .element("body", `${body}`).up().toString());
    } catch (err) {
        console.log(err);
    }
}

function getPresenceFromUser(fromId, toId, offline) {
    try {
        if (!global.Clients) return;

        let SenderData = global.Clients.find(i => i.accountId == fromId);
        let ClientData = global.Clients.find(i => i.accountId == toId);

        if (!SenderData || !ClientData) return;

        let xml = XMLBuilder.create("presence")
            .attribute("to", ClientData.jid)
            .attribute("xmlns", "jabber:client")
            .attribute("from", SenderData.jid)
            .attribute("type", offline ? "unavailable" : "available")

        if (SenderData.lastPresenceUpdate.away) xml = xml.element("show", "away").up().element("status", SenderData.lastPresenceUpdate.status).up();
        else xml = xml.element("status", SenderData.lastPresenceUpdate.status).up();

        ClientData.client.send(xml.toString());
    } catch (err) {
        console.log(err);
    }
}

function getOfferID(offerId) {
    try {
        const shop = require("./shop");
        const catalog = shop.getShop();

        for (let storefront of catalog.storefronts) {
            let findOfferId = storefront.catalogEntries.find(i => i.offerId == offerId);

            if (findOfferId) return {
                name: storefront.name,
                offerId: findOfferId
            };
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    GetVersionInfo,
    getRandomElement,
    getRandomElementAndIndex,
    getRandomNumber,
    sleep,
    sendXmppMessageToAll,
    sendXmppMessageToId,
    getPresenceFromUser,
    getOfferID
}