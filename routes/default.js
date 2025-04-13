const { v4: uuidv4 } = require("uuid");

const gameservers = require("../gameserverConfig.json");

global.activeServers = {};

async function defaultRoutes(fastify, options) {
    fastify.all('/', async (request, reply) => {
        reply.status(200).send({
            status: 'success',
            message: 'Welcome to ArcaneV5!',
            service: "Arcane Backend",
            metadata: {
                version: 'V5',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                method: request.method,
                url: request.url
            }
        })
    });

    fastify.post('/server/status', async (request, reply) => {
        const { serverName } = request.body;
        if (!request.body || !serverName) {
            return reply.status(200).send({
                onlineServers: global.serverOnline
            })
        }
        plainTextGameservers = JSON.stringify(gameservers);
        //console.log(plainTextGameservers);
        if (!plainTextGameservers.includes(`"${serverName}"`)) {
            return reply.status(400).send({
                error: "Invalid server name"
            })
        }
        global.serverOnline.push(serverName);

        return reply.status(200).send({
            onlineServers: global.serverOnline
        })
    })

    fastify.post('/server/status/create', async (request, reply) => {
        const { region, playlist, serverAddress, serverPort, key } = request.body;
        if (!region || !playlist || !serverAddress || !serverPort || !key) {
            return reply.status(404).send("Bad Request!");
        }
        if (key != process.env.JWT_SECRET) {
            return reply.status(404).send("Invalid key!");
        }

        if (global.activeServers[region]) {
            if (global.activeServers[region][playlist.toLowerCase()]) {
                global.activeServers[region][playlist.toLowerCase()].push({
                    "gameserverIP": serverAddress,
                    "gameserverPort": serverPort,
                    "PLAYLISTNAME_s": playlist,
                    "serverName": `[DS]fortnite-liveplaylist-${playlist.toLowerCase()}-${region.toLowerCase()}-${global.activeServers[region][playlist.toLowerCase()].length}`
                })
            } else {
                global.activeServers[region][playlist.toLowerCase()] = [
                    {
                        "gameserverIP": serverAddress,
                        "gameserverPort": serverPort,
                        "PLAYLISTNAME_s": playlist,
                        "serverName": `[DS]fortnite-liveplaylist-${playlist.toLowerCase()}-${region.toLowerCase()}-0`
                    }
                ]
            }
        } else {
            global.activeServers[region] = {
                [playlist.toLowerCase()]: [
                    {
                        "gameserverIP": serverAddress,
                        "gameserverPort": serverPort,
                        "PLAYLISTNAME_s": playlist,
                        "serverName": `[DS]fortnite-liveplaylist-${playlist.toLowerCase()}-${region.toLowerCase()}-0`
                    }
                ]
            }
        }

        return reply.status(200).send(global.activeServers);
    })
}

module.exports = defaultRoutes;