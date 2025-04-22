const DiscoveryUser = require("../../database/models/DiscoveryUser");

async function creator(fastify, options) {
    fastify.get('/api/v1/creator/page/:creatorAccountId', async (request, reply) => {
        const user = await DiscoveryUser.findOne({ accountId: request.params.creatorAccountId });
        if (!user) {
            reply.status(404).send();
        }
        
        reply.status(200).send({
            "creatorId": user.accountId,
            "links": user.profile.discoverySurface,
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