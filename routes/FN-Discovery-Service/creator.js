const DiscoveryUser = require("../../database/models/DiscoveryUser");

async function creator(fastify, options) {
    fastify.get('/api/v1/creator/page/:creatorAccountId', (request, reply) => {
        reply.status(200).send({
            "creatorId": "epic",
            "links": [],
            "hasMore": false
        })
    })

    fastify.get('/page/v1/:creator', async (request, reply) => {
        const user = await DiscoveryUser.findOne({ accountId: request.params.creator });
        if (!user) {
            reply.status(404).send();
        }
        reply.status(200).send(user.profile.page);
    })
}

module.exports = creator;