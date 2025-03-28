const fs = require('fs');
const path = require('path');

const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");
const discoveryV2 = require("../../responses/fortniteConfig/discovery/discoveryv2.json");

const functions = require("../../utils/functions");

const DiscoverySystem = require("../../database/models/DiscoverySystem");
const DiscoveryUser = require("../../database/models/DiscoveryUser");

async function discoveryRoutes(fastify, options) {
    // Catagory: Uncatagorized

    fastify.post('/api/v2/discovery/surface/CreativeDiscoverySurface_Frontend', async (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        if (memory.build >= 26.30) {
            const epicDiscoveryUser = await DiscoveryUser.findOne({ accountId: "epic" });
            discoveryV2.panels.push({
                "panelName": "ByEpic33.20",
                "panelDisplayName": "By Epic",
                "panelSubtitle": "Created by Epic Games",
                "featureTags": [
                    "maxVisibleRows:2",
                    "col:5",
                    "hasViewAll:true",
                    "horizontalScroll:false"
                ],
                "firstPage": {
                    "results": epicDiscoveryUser.createdIslands_Frontend,
                    "hasMore": true,
                    "panelTargetName": null,
                    "pageMarker": null
                },
                "panelType": "AnalyticsList",
                "playHistoryType": null,
                "panelContexts": {}
            },
            {
                "panelName": "ArcaneV5",
                "panelDisplayName": "Arcane Backend",
                "panelSubtitle": "Welcome to ArcaneV5!",
                "featureTags": [
                    "col:5"
                ],
                "firstPage": {
                    "results": [
                        {
                            "lastVisited": "2025-02-23T21:18:10.865Z",
                            "linkCode": "0000-0000-0001",
                            "isFavorite": true,
                            "globalCCU": 69189020,
                            "lockStatus": "UNLOCKED",
                            "lockStatusReason": "RATING_THRESHOLD",
                            "isVisible": true,
                            "favoriteStatus": "NONE"
                        }
                    ],
                    "hasMore": false,
                    "panelTargetName": null,
                    "pageMarker": null
                },
                "panelType": "AnalyticsList",
                "playHistoryType": null,
                "panelContexts": {}
            })
            return reply.status(200).send(discoveryV2);
        } else {
            return reply.status(200).send(discovery);
        }
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
        const memory = functions.GetVersionInfo(request);
        if (memory.build >= 26.30) {
            return reply.status(200).send(discoveryV2);
        } else {
            return reply.status(200).send(discovery);
        }
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
        const memory = functions.GetVersionInfo(request);
        if (memory.build >= 26.30) {
            return reply.status(200).send(discoveryV2);
        } else {
            return reply.status(200).send(discovery);
        }
    })

    fastify.post('/api/v1/discovery/surface/*', (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        if (memory.build >= 26.30) {
            return reply.status(200).send(discoveryV2);
        } else {
            return reply.status(200).send(discovery);
        }
    })

    fastify.post('/api/v2/discovery/surface/*', (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        if (memory.build >= 26.30) {
            return reply.status(200).send(discoveryV2);
        } else {
            return reply.status(200).send(discovery);
        }
    })
}

module.exports = discoveryRoutes;