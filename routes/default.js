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
}

module.exports = defaultRoutes;