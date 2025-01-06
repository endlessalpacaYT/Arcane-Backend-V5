const fastify = require('fastify')();
const formbody = require('@fastify/formbody');
const rateLimit = require('@fastify/rate-limit');
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const schedule = require('node-schedule');
require("dotenv").config();

const errors = require("./responses/errors.json");
const createError = require("./utils/error.js");
const logger = require("./utils/logger.js");
const connectMongo = require("./database/connect.js");
const shop = require("./utils/shop.js");

const PORT = Number(process.env.PORT) || 3551;
const IP = process.env.IP || "0.0.0.0";

fastify.register(rateLimit, {
    global: true,
    max: 70,
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
    createError.createError(errors.NOT_FOUND.common, 404, reply);
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
        connectMongo();
        require("./xmpp/index.js");
        shop.generateCatalog();
        require("./Panel/index.js");
    });
}

schedule.scheduleJob('0 0 * * *', () => {
    shop.generateDaily();
});

schedule.scheduleJob('0 0 * * 0', () => {
    shop.generateFeatured();
});

startBackend();