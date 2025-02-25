async function datarouter(fastify, options) {
    fastify.post('/datarouter/api/v1/public/data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.options('/datarouter/api/v1/public/data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/datarouter/api/v1/public/data/clients', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/telemetry/data/datarouter/api/v1/public/data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/telemetry/data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/api/content/v2/launch-data', (request, reply) => {
        reply.status(204).send();
    })

    fastify.options('/v1/business-units/find', (request, reply) => {
        reply.status(204).send();
    })

    fastify.put('/fortnite/api/feedback/*', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = datarouter;