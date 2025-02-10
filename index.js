const fastify = require('fastify')();
const formbody = require('@fastify/formbody');
const rateLimit = require('@fastify/rate-limit');
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

const PORT = Number(process.env.PORT) || 3551;
const IP = process.env.IP || "0.0.0.0";

global.secretKey = uuidv4();

fastify.register(require('@fastify/cors'), {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  });

if (process.env.singleplayer == "false") {
    fastify.register(rateLimit, {
        global: true,
        max: 100,
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

fastify.setNotFoundHandler((request, reply) => {
    logger.backend(`[${new Date().toISOString()}] 404 Not Found - ${request.method} ${request.url}`);
    if (process.env.singleplayer == "true") {
        //reply.status(200).send();
        createError.createError(errors.NOT_FOUND.common, 404, reply);
    } else {
        createError.createError(errors.NOT_FOUND.common, 404, reply);
    }
});

fastify.setErrorHandler((error, request, reply) => {
    if (error.statusCode == 429) {
        return reply.status(429).send(error);
    }
    console.error(error);
    return createError.createError(errors.SERVER_ERROR.common, 500, reply);
});

async function startBackend() {
    fastify.listen({ port: PORT, host: IP }, (err, address) => {
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
        shop.generateCatalog();
        require("./lobbyBot/index.js");
        require("./Panel/index.js");
        if (process.env.DISCORD_ENABLED == "true") {
            require("./DiscordBot/index.js");
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
