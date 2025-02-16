async function legal(fastify, options) {
    const eulaData = [
        {
            id: "ArcaneV5",
            locale: "en",
            title: "ArcaneV5",
            body: "End User License Agreement for ArcaneV5 - Version 1.0"
        },
    ];

    fastify.get("/eulatracking/api/shared/agreements/fn", (request, reply) => {
        reply.status(200).send(eulaData);
    });

    fastify.get("/eulatracking/api/public/agreements/fn/account/:accountId", (request, reply) => {
        reply.status(204).send();
    });

    fastify.get('/eulatracking/api/public/agreements/:eula/account/:accountId', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = legal;