const fastify = require('fastify')();
const formbody = require('@fastify/formbody');
const rateLimit = require('@fastify/rate-limit');
const fastifyCookie = require('@fastify/cookie');
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const schedule = require('node-schedule');
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
require("dotenv").config();

const errors = require("./responses/errors.json");
const createError = require("./utils/error.js");
const logger = require("./utils/logger.js");
const connectMongo = require("./database/connect.js");
const shop = require("./utils/shop.js");

const PORT = Number(process.env.PORT) || 3551;
const IP = process.env.IP || "0.0.0.0";

global.buildid = process.env.BUILDID || "0";
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
                "errorCode": "errors.com.epicgames.common.throttled",
                "errorMessage": "You are being rate limited.",
                "numericErrorCode": 1009,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod"
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
    request.correlationId = correlationId;
    reply.header("X-Epic-Correlation-ID", correlationId);

    if (!request.cookies.EPIC_DEVICE) {
        reply.setCookie("EPIC_DEVICE", crypto.randomBytes(16).toString("hex"), { path: "/" });
    } else {
        reply.setCookie("EPIC_DEVICE", request.cookies.EPIC_DEVICE, { path: "/" });
    }
});

fastify.setNotFoundHandler((request, reply) => {
    if (request.url.includes("/account/api/oauth/sessions/kill")) {
        return reply.status(204).send();
    }

    logger.backend(`[${new Date().toISOString()}] 404 Not Found - ${request.method} ${request.url}`);
    return createError.createError({
        "errorCode": "errors.com.epicgames.common.not_found",
        "errorMessage": "Sorry the resource you were trying to find could not be found",
        "numericErrorCode": 1004,
        "originatingService": "com.epicgames.account.public",
        "intent": "prod"
    }, 404, reply);
});

fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode == 429) {
        return createError.createError(error, 429, reply);
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
    try {
        console.log(`
            █████╗ ██████╗  ██████╗ █████╗ ███╗   ██╗███████╗██╗   ██╗███████╗
           ██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝██║   ██║██╔════╝
           ███████║██████╔╝██║     ███████║██╔██╗ ██║█████╗  ██║   ██║███████╗
           ██╔══██║██╔══██╗██║     ██╔══██║██║╚██╗██║██╔══╝  ╚██╗ ██╔╝╚════██║
           ██║  ██║██║  ██║╚██████╗██║  ██║██║ ╚████║███████╗ ╚████╔╝ ███████║
           ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝  ╚═══╝  ╚══════╝`);

        connectMongo();

        fastify.listen({ port: PORT, host: IP }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            logger.backend(`ArcaneV5 Running On ${address}`);
            logger.backend(`Generated Secret Key: ${global.secretKey}`);

            loadServices();
        });
    } catch (err) {
        console.error("Failed to start backend:", err);
        process.exit(1);
    }
}

function loadServices() {
    require("./xmpp/index.js");

    shop.generateCatalog();
    require("./admin/index.js");
    require("./lobbyBot/index.js");
    require("./Panel/index.js");

    if (process.env.DISCORD_ENABLED === "true") {
        require("./DiscordBot/index.js");
    }

    if (process.env.STEAM_ENABLED === "true") {
        require("./Services/Steam/index.js");
    }
}

schedule.scheduleJob("0 0 * * *", () => {
    shop.generateDaily();
});

schedule.scheduleJob("0 0 * * 0", () => {
    shop.generateFeatured();
});

startBackend();
