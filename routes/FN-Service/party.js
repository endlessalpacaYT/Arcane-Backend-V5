const sjcl = require("sjcl");

async function party(fastify, options) {
    fastify.get("/fortnite/api/game/v2/voice/:accountId/login", async (request, reply) => {
        const { accountId } = request.params;
        const user_uri = `sip:.24753-evora-89674-udash.${accountId}.@mtu1xp.vivox.com`;

        const d = new Date();
        d.setHours(d.getHours() + 2);
        const vivoxClaims = {
            "iss": "24753-evora-89674-udash",
            "exp": Math.floor(d.getTime() / 1000),
            "vxa": "login",
            "vxi": Math.round(Math.random() * 1000000),
            "f": user_uri,
        };

        const token = vxGenerateToken("zcETsPpEAysznTyDXK4TEzwLQPcTvTAO", JSON.stringify(vivoxClaims));

        return reply.status(200).send({ token: token });
    });

    fastify.get("/fortnite/api/game/v2/voice/:accountId/join/:pid", async (request, reply) => {
        const { accountId, pid } = request.params;
        const channel_uri = `sip:confctl-g-24753-evora-89674-udash.${pid}@mtu1xp.vivox.com`;
        const user_uri = `sip:.24753-evora-89674-udash.${accountId}.@mtu1xp.vivox.com`;

        const d = new Date();
        d.setHours(d.getHours() + 2);
        const vivoxClaims = {
            "iss": "24753-evora-89674-udash",
            "exp": Math.floor(d.getTime() / 1000),
            "vxa": "join",
            "vxi": Math.round(Math.random() * 1000000),
            "f": user_uri,
            "t": channel_uri,
        };

        const token = vxGenerateToken("zcETsPpEAysznTyDXK4TEzwLQPcTvTAO", JSON.stringify(vivoxClaims));

        return reply.status(200).send({ token: token });
    });

    fastify.get('/party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count', async (request, reply) => {
        return reply.status(200).send({
            "pings": 0,
            "invites": 0,
        });
    });

    fastify.get('/party/api/v1/Fortnite/user/:accountId', async (request, reply) => {
        return reply.status(200).send({
            "current": [],
            "pending": [],
            "invites": [],
            "pings": []
        });
    });
}

function base64URLEncode(value) {
    return Buffer.from(value).toString('base64')
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/\=+$/, "");
}

function vxGenerateToken(key, payload) {
    const base64urlHeader = base64URLEncode("{}");
    const base64urlPayload = base64URLEncode(payload);
    const segments = [base64urlHeader, base64urlPayload];
    const toSign = segments.join(".");
    const hmac = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(key), sjcl.hash.sha256);
    const signature = sjcl.codec.base64.fromBits(hmac.encrypt(toSign));
    const base64urlSigned = signature
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/\=+$/, "");

    segments.push(base64urlSigned);

    return segments.join(".");
}

module.exports = party;