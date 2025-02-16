const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");

async function discovery(fastify, options) {
    // Catagory: Uncatagorized

    // idk the response
    fastify.get('/api/v1/discovery/hub/portals', (request, reply) => {
        reply.status(204).send();
    })

    // Catagory: V1
    fastify.post('/api/v1/discovery/surface/:accountId', (request, reply) => {
        reply.status(200).send({
            "panels": [
                {
                    "panelName": "RecentlyPlayed",
                    "pages": [
                        {
                            "results": [],
                            "hasMore": false
                        }
                    ]
                },
                {
                    "panelName": "Favorites",
                    "pages": [
                        {
                            "results": [],
                            "hasMore": false
                        }
                    ]
                }
            ],
            "testCohorts": ["librarytest"]
        })
    })

    fastify.post('/api/v1/discovery/surface/page/:accountId', (request, reply) => {
        reply.status(200).send({
            "results": [],
            "hasMore": false
        })
    })

    // Catagory: V2
    fastify.post('/api/v2/discovery/surface/:surfaceName/page', (request, reply) => {
        reply.status(200).send({
            "results": [],
            "hasMore": false,
            "panelTargetName": null,
            "pageMarker": null
        })
    })

    fastify.post('/fortnite/api/game/v2/creative/discovery/surface/:accountId', (request, reply) => {
        return reply.status(200).send(discovery);
    })

    fastify.post('/api/v1/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discovery);
    })

    fastify.post('/api/v2/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discovery);
    })
}

module.exports = discovery;