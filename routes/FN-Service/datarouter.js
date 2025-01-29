async function datarouter(fastify, options) {
    fastify.post('/datarouter/api/v1/public/data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/datarouter/api/v1/public/data/clients', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/telemetry/data/datarouter/api/v1/public/data', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = datarouter;