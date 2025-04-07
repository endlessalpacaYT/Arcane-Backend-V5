const assets = require("../../responses/fortniteConfig/assets/assets.json");
const functions = require("../../utils/functions");

async function assetsRoutes(fastify, options) {
    fastify.post('/api/v1/assets/:gameId/:branch/:changelist', (request, reply) => {
        if (request.body.hasOwnProperty("FortCreativeDiscoverySurface") && request.body.FortCreativeDiscoverySurface == 0) {
            assets.FortCreativeDiscoverySurface.meta.promotion = request.body.FortCreativeDiscoverySurface || 1;
            const memory = functions.GetVersionInfo(request);
            if (memory.season == 26) {
                return reply.status(200).send(require("../../responses/fortniteConfig/assets/seasonal/26.json"));
            }
            return reply.status(200).send(assets)
        } else {
            reply.status(200).send({
                "FortCreativeDiscoverySurface": {
                    "meta": {
                        "promotion": request.body.FortCreativeDiscoverySurface || 0
                    },
                    "assets": {}
                }
            })
        }
    })
}

module.exports = assetsRoutes;