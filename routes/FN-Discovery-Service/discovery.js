const fs = require('fs');
const path = require('path');

const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");
const discoveryV2 = require("../../responses/fortniteConfig/discovery/discoveryv2.json");

async function discoveryRoutes(fastify, options) {
    // Catagory: Uncatagorized

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_Frontend', (request, reply) => {
        reply.status(200).send(discoveryV2);
    })

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_Library_V2', (request, reply) => {
        const library_V2 = require("../../responses/fortniteConfig/discovery/CreativeDiscoverySurface_Library_V2.json");
        reply.status(200).send(library_V2);
    })

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_Browse', (request, reply) => {
        const browse = require("../../responses/fortniteConfig/discovery/CreativeDiscoverySurface_Browse.json");
        reply.status(200).send(browse);
    })

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_EpicPage', (request, reply) => {
        const epicPage = require("../../responses/fortniteConfig/discovery/CreativeDiscoverySurface_EpicPage.json");
        reply.status(200).send(epicPage);
    })

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_ArcanePage', (request, reply) => {
        const arcanePage = require("../../responses/fortniteConfig/discovery/CreativeDiscoverySurface_ArcanePage.json");
        reply.status(200).send(arcanePage);
    })

    fastify.post('/api/v2/discovery/surface/:surface', (request, reply) => {
        const discoverySurface = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "discovery", "DiscoverySurfaceAssets", `${request.params.surface}.json`);
        if (!fs.existsSync(discoverySurface)) {
            console.warn(`Discovery Surface ${request.params.surface} not found`);
            reply.status(404).send();
        } else {
            reply.status(200).send(require(discoverySurface));
        }
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
        const { panelName, pageIndex } = request.body;

        if (request.params.surfaceName == "CreativeDiscoverySurface_Frontend") {
            return reply.status(200).send({
                "results": [],
                "hasMore": false,
                "panelTargetName": null,
                "pageMarker": null
            })
        }

        if (pageIndex == 1) {
            let firstPage;
            for (let i = 0; i < discoveryV2.panels.length; i++) {
                if (discoveryV2.panels[i].panelName === panelName) {
                    firstPage = {
                        "results": discoveryV2.panels[i].firstPage.results,
                        "hasMore": false,
                        "panelTargetName": discoveryV2.panels[i].panelTargetName,
                        "pageMarker": discoveryV2.panels[i].pageMarker
                    };
                    break;
                }
            }
            if (!firstPage) {
                return reply.status(404).send();
            }

            return reply.status(200).send(firstPage);
        } else {
            return reply.status(200).send({
                "results": [],
                "hasMore": false,
                "panelTargetName": null,
                "pageMarker": null
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/creative/discovery/surface/:accountId', (request, reply) => {
        return reply.status(200).send(discoveryV2);
    })

    fastify.post('/api/v1/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discovery);
    })

    /*fastify.post('/api/v2/discovery/surface/*', (request, reply) => {
        return reply.status(200).send(discoveryV2);
    })*/
}

module.exports = discoveryRoutes;