async function feedback(fastify, options) {
    fastify.post('/fortnite/api/feedback/:type', async (request, reply) => {
        reply.status(200).send();
    })
}

module.exports = feedback;