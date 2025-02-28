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
        global.serverOnline.push(serverName);

        return reply.status(200).send({
            onlineServers: global.serverOnline
        })
    })
}

module.exports = defaultRoutes;