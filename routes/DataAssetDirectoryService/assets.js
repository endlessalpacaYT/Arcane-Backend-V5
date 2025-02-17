const assets = require("../../responses/fortniteConfig/assets/assets.json");

async function assetsRoutes(fastify, options) {
    fastify.post('/api/v1/assets/:gameId/:branch/:changelist', (request, reply) => {
        reply.status(200).send(assets);
    })
}

module.exports = assetsRoutes;