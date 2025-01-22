async function api(fastify, options) {
    fastify.get('/api/v1/launcher/version', async (request, reply) => {
        reply.status(200).send({
            "current_version": "0.2.0",
        })
    })

    app.get('/api/v1/launcher/update', async (request, reply) => {
        reply.status(200).send({
            "update": "https://cdn.pongodev.com"
        })
    })

    app.get('/api/v1/launcher/news', async (request, reply) => {
        reply.status(200).send();
    })

    app.get('/api/v1/launcher/build', async (request, reply) => {
        reply.status(200).send();
    })

    app.get('/api/v1/launcher/status', async (request, reply) => {
        reply.status(200).send({
            "STATUS": "online"
        });
    })
}

module.exports = api;