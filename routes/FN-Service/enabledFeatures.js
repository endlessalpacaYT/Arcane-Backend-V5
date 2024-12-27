async function enabledFeatures(fastify, options) {
    fastify.post("/fortnite/api/game/v2/chat/:accountId/*", (request, reply) => {
        reply.status(200).send({
            "GlobalChatRooms": [
                {
                    "roomName": "ArcaneV5"
                }
            ]
        });
    });

    fastify.get('/fortnite/api/game/v2/enabled_features', (request, reply) => {
        reply.status(200).send(["store"])
    })
}

module.exports = enabledFeatures;