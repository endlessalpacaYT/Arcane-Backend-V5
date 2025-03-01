const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");
const discoveryV2 = require("../../responses/fortniteConfig/discovery/discoveryv2.json");

async function discoveryRoutes(fastify, options) {
    // Catagory: Uncatagorized

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_Frontend', (request, reply) => {
        reply.status(200).send(discoveryV2);
    })

    // idk the response
    fastify.get('/api/v1/discovery/hub/portals', (request, reply) => {
        reply.status(204).send();
    })

    // Catagory: V1
    fastify.post('/api/v1/discovery/surface/:accountId', (request, reply) => {
        reply.status(200).send(discovery);
    })

    fastify.post('/api/v1/discovery/surface/page/:accountId', (request, reply) => {
        reply.status(200).send({
            "results": [],
            "hasMore": false
        })
    })

    // Catagory: V2
    fastify.post('/api/v2/discovery/surface/:surfaceName/page', (request, reply) => {
        const { panelName } = request.body;

        let firstPage;
        for (let i = 0; i < discoveryV2.panels.length; i++) {
            if (discoveryV2.panels[i].panelName === panelName) {
                firstPage = discoveryV2.panels[i].firstPage;
                break;
            }
        }
        if (!firstPage) {
            return reply.status(404).send();
        }

        reply.status(200).send(firstPage);
    })

    fastify.post('/fortnite/api/game/v2/creative/discovery/surface/:accountId', (request, reply) => {
        return reply.status(200).send(discoveryV2);
    })

    fastify.post('/api/v1/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discovery);
    })

    fastify.post('/api/v2/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discoveryV2);
    })
}

module.exports = discoveryRoutes;