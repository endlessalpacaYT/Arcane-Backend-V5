const fastify = require('fastify')();
const formbody = require('@fastify/formbody');
const rateLimit = require('@fastify/rate-limit');
const fastifyCookie = require('@fastify/cookie');
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const schedule = require('node-schedule');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const errors = require("./responses/errors.json");
const createError = require("./utils/error.js");
const logger = require("./utils/logger.js");
const connectMongo = require("./database/connect.js");
const shop = require("./utils/shop.js");
const database = require("./lobbyBot/User/database");

const DiscoverySystem = require("./database/models/DiscoverySystem.js");

const PORT = Number(process.env.PORT) || 3551;
const IP = process.env.IP || "0.0.0.0";

global.secretKey = uuidv4();

fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
fastify.register(fastifyCookie);

if (process.env.singleplayer == "false" && process.env.USE_RATELIMITER == "true") {
    fastify.register(rateLimit, {
        global: true,
        max: 200,
        timeWindow: '1 minute',
        allow: ['127.0.0.1'],
        errorResponseBuilder: (request, context) => {
            return {
                statusCode: 429,
                error: 'Too Many Requests',
                message: `You have exceeded the limit of ${context.max} requests per ${context.after}. Please try again later.`,
            };
        },
    });
}

fastify.register(formbody);
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (request, body, done) => {
    if (!body) {
        done(null, {});
    } else {
        try {
            done(null, JSON.parse(body));
        } catch (err) {
            done(err, undefined);
        }
    }
});
fastify.addContentTypeParser('*', (request, payload, done) => {
    let data = '';
    payload.on('data', chunk => {
        data += chunk;
    });
    payload.on('end', () => {
        done(null, data);
    });
    payload.on('error', err => {
        done(err);
    });
});

fs.readdirSync(path.join(__dirname, "./routes")).forEach(fileName => {
    const filePath = path.join(__dirname, "./routes", fileName);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        fs.readdirSync(filePath).forEach(subFile => {
            const subFilePath = path.join(filePath, subFile);
            if (subFile.endsWith('.js')) {
                try {
                    fastify.register(require(subFilePath));
                } catch (err) {
                    console.error(`Error Registering Route: ${subFilePath}, Error: ` + err);
                }
            }
        });
    } else if (fileName.endsWith('.js')) {
        try {
            fastify.register(require(filePath));
        } catch (err) {
            console.error(`Error Registering Route: ${filePath}, Error: ` + err);
        }
    }
});

fastify.addHook("onRequest", async (request, reply) => {
    const correlationId = uuidv4();
    request.headers["X-Epic-Correlation-ID"] = correlationId;
    request.correlationId = correlationId;
    reply.header("X-Epic-Correlation-ID", correlationId);

    if (!request.cookies.EPIC_DEVICE) {
        reply.setCookie("EPIC_DEVICE", uuidv4().replace(/-/ig, ""), {
            path: "/"
        });
    } else {
        reply.setCookie("EPIC_DEVICE", request.cookies.EPIC_DEVICE, {
            path: "/"
        });
    }
});

fastify.setNotFoundHandler((request, reply) => {
    if (request.url.includes("/account/api/oauth/sessions/kill")) {
        return reply.status(204).send();
    }

    logger.backend(`[${new Date().toISOString()}] 404 Not Found - ${request.method} ${request.url}`);
    if (process.env.singleplayer == "true") {
        //reply.status(200).send();
        createError.createError({
            "errorCode": "errors.com.epicgames.common.not_found",
            "errorMessage": "Sorry the resource you were trying to find could not be found",
            "numericErrorCode": 1004,
            "originatingService": "com.epicgames.account.public",
            "intent": "prod"
        }, 404, reply);
    } else {
        createError.createError({
            "errorCode": "errors.com.epicgames.common.not_found",
            "errorMessage": "Sorry the resource you were trying to find could not be found",
            "numericErrorCode": 1004,
            "originatingService": "com.epicgames.account.public",
            "intent": "prod"
        }, 404, reply);
    }
});

fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode == 429) {
        return reply.status(429).send(error);
    }
    console.error(error);
    const trackingId = uuidv4();
    reply.header("X-Epic-Error-Tracking-ID", trackingId);
    return createError.createError({
        "errorCode": "errors.com.epicgames.common.server_error",
        "errorMessage": `Sorry an error occurred and we were unable to resolve it (tracking id: [${trackingId}])`,
        "messageVars": [
            trackingId
        ],
        "numericErrorCode": 1000,
        "originatingService": "com.epicgames.account.public",
        "intent": "prod",
        "trackingId": trackingId
    }, 500, reply);
});

async function startBackend() {
    fastify.listen({ port: PORT, host: IP }, async (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`
            █████╗ ██████╗  ██████╗ █████╗ ███╗   ██╗███████╗██╗   ██╗███████╗
           ██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝██║   ██║██╔════╝
           ███████║██████╔╝██║     ███████║██╔██╗ ██║█████╗  ██║   ██║███████╗
           ██╔══██║██╔══██╗██║     ██╔══██║██║╚██╗██║██╔══╝  ╚██╗ ██╔╝╚════██║
           ██║  ██║██║  ██║╚██████╗██║  ██║██║ ╚████║███████╗ ╚████╔╝ ███████║
           ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝  ╚═══╝  ╚══════╝`);
        logger.backend(`ArcaneV5 Running On ${address}`);
        logger.backend(`Generated Secret Key: ${global.secretKey}`);
        connectMongo();
        if (process.env.XMPPV2_ENABLED == "true") {
            require("./xmpp/v2/index.js");
        } else {
            require("./xmpp/v1/index.js");
        }
        await shop.generateCatalog();
        shop.getShop();
        //shop.getCatalogEntry(["AthenaDance:EID_ChairTime"], 200)
        require("./admin/index.js")
        require("./lobbyBot/index.js");
        require("./Panel/index.js");
        if (process.env.DISCORD_ENABLED == "true") {
            require("./DiscordBot/index.js");
        }
        if (process.env.STEAM_ENABLED == "true") {
            require("./Services/Steam/index.js");
        }
    });
}

schedule.scheduleJob('0 0 * * *', () => {
    shop.generateDaily();
});

schedule.scheduleJob('0 0 * * 0', () => {
    shop.generateFeatured();
});

startBackend();
