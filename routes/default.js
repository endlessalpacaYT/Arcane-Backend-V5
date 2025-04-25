const { v4: uuidv4 } = require("uuid");

const gameservers = require("../gameserverConfig.json");
const playlistPaths = require("../playlists.json");
const matchmaker = require("../Matchmaker/index");

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
        console.log(request.body);

        if (global.activeServers[region]) {
            if (global.activeServers[region][playlist.toLowerCase()]) {
                global.activeServers[region][playlist.toLowerCase()].push({
                    "gameserverIP": serverAddress,
                    "gameserverPort": serverPort,
                    "PLAYLISTNAME_s": playlist,
                    "REGION_s": region,
                    "serverName": `[DS]fortnite-liveplaylist-${playlist.toLowerCase()}-${region.toLowerCase()}-${global.activeServers[region][playlist.toLowerCase()].length}`
                })
            } else {
                global.activeServers[region][playlist.toLowerCase()] = [
                    {
                        "gameserverIP": serverAddress,
                        "gameserverPort": serverPort,
                        "PLAYLISTNAME_s": playlist,
                        "REGION_s": region,
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
                        "REGION_s": region,
                        "serverName": `[DS]fortnite-liveplaylist-${playlist.toLowerCase()}-${region.toLowerCase()}-0`
                    }
                ]
            }
        }

        return reply.status(200).send(global.activeServers);
    })

    function getMostQueuedPlaylist(region) {
        try {
            const playlists = global.queuedPlayers[region];
            if (!playlists) return null;

            let maxPlaylist = null;
            let maxCount = -1;

            for (const [playlist, count] of Object.entries(playlists)) {
                if (count > maxCount) {
                    maxCount = count;
                    maxPlaylist = playlist;
                }
            }

            if (maxCount == 0) {
                return "none";
            }

            return maxPlaylist;
        } catch {
            return "none";
        }
    }

    fastify.post('/server/status/getinfo', async (request, reply) => {
        const { region } = request.body;
        if (!region) {
            return reply.status(404).send("Bad Request!");
        }
        const queuedPlaylist = matchmaker.getMostQueuedPlaylist(region);
        if (queuedPlaylist == "none" || !queuedPlaylist) {
            return reply.status(200).send("none");
        }
        if (!playlistPaths[queuedPlaylist]) {
            return reply.status(200).send("none");
        }
        
        return reply.status(200).send(playlistPaths[queuedPlaylist]);
    })

    fastify.post('/server/status/getinfo/nodelete', async (request, reply) => {
        const { region } = request.body;
        if (!region) {
            return reply.status(404).send("Bad Request!");
        }
        const queuedPlaylist = matchmaker.getMostQueuedPlaylist(region);
        if (queuedPlaylist == "none" || !queuedPlaylist) {
            return reply.status(200).send("none");
        }
        if (!playlistPaths[queuedPlaylist]) {
            return reply.status(200).send("none");
        }

        return reply.status(200).send(playlistPaths[queuedPlaylist]);
    })
}

module.exports = defaultRoutes;