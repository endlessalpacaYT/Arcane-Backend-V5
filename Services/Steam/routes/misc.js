async function misc(fastify, options) {
    fastify.get('/204', (request, reply) => {
        return reply.status(204).send();
    });
}

module.exports = misc;