const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");
const discoveryV2 = require("../../responses/fortniteConfig/discovery/discoveryv2.json");
const mnemonicV2 = require("../../responses/fortniteConfig/discovery/mnemonic.json");

async function mnemonic(fastify, options) {
    fastify.post("/links/api/fn/mnemonic", async (request, reply) => {
        let MnemonicArray = [];

        if (Number(process.env.SEASON >= 27)) {
            return reply.status(200).send(mnemonicV2);
            if (request.body) {
                if (request.body.length = 1) {
                    if (!request.body[0].mnemonic) {
                        return reply.status(200).send(mnemonicV2);
                    }
                }
                for (let i = 0; i < request.body.length; i++) {
                    for (let x = 0; x < mnemonicV2.length; x++) {
                        if (mnemonicV2[x].mnemonic == request.body[i].mnemonic) {
                            MnemonicArray.push(mnemonicV2[x]);
                        }
                    }
                }
            } else {
                return reply.status(200).send(mnemonicV2);
            }
        } else {
            for (let x = 0; x < discovery.Panels.length; x++) {
                for (let z = 0; z < discovery.Panels[x].Pages.length; z++) {
                    for (let i in discovery.Panels[x].Pages[z].results) {
                        MnemonicArray.push(discovery.Panels[x].Pages[z].results[i].linkData)
                    }
                }
            }
        }

        reply.status(200).send(MnemonicArray);
    });

    fastify.get("/links/api/fn/mnemonic/:playlist/related", async (request, reply) => {
        let response = {
            "parentLinks": [],
            "links": {}
        };

        if (Number(process.env.SEASON >= 27)) {
            if (request.params.playlist) {
                /*if (request.params.playlist == "playlist_defaultsolo") {
                    return reply.status(200).send(require("./playlist_defaultsolo.json"));
                }*/
                for (let i = 0; i < mnemonicV2.length; i++) {
                    if (mnemonicV2[i].mnemonic == request.params.playlist) {
                        if (mnemonicV2[i].metadata.parent_set) {
                            request.params.playlist = mnemonicV2[i].metadata.parent_set;
                            let index = mnemonicV2.findIndex(x => x.mnemonic == request.params.playlist);
                            response.parentLinks.push(mnemonicV2[index]);

                            if (mnemonicV2[index].metadata.corresponding_sets.ranked) {
                                index = mnemonicV2.findIndex(x => x.mnemonic == mnemonicV2[index].metadata.corresponding_sets.ranked);
                                response.parentLinks.push(mnemonicV2[index]);
                            }
                            break;
                        } else {
                            response.parentLinks.push(mnemonicV2[i]);
                            break;
                        }
                    }
                }

                for (let i = 0; i < response.parentLinks.length; i++) {
                    if (response.parentLinks[i].metadata.sub_link_codes) {
                        for (let y = 0; y < response.parentLinks[i].metadata.sub_link_codes.length; y++) {
                            const index = mnemonicV2.findIndex(x => x.mnemonic == response.parentLinks[i].metadata.sub_link_codes[y]);
                            if (index != -1) {
                                response.links = {
                                    ...response.links,
                                    [mnemonicV2[index].mnemonic]: mnemonicV2[index]
                                }
                            }
                        }
                    }

                    if (response.parentLinks[i].metadata.fallback_links && response.parentLinks[i].metadata.fallback_links.graceful) {
                        for (let y = 0; y < mnemonicV2.length; y++) {
                            if (mnemonicV2[y].mnemonic == response.parentLinks[i].metadata.fallback_links.graceful) {
                                response.links = {
                                    ...response.links,
                                    [mnemonicV2[y].mnemonic]: mnemonicV2[y]
                                };
                            }
                        }
                    }
                }
            }

            /*for (let i = 0; i < discoveryV2.panels.length; i++) {
                for (let x in discoveryV2.panels[i].firstPage.results) {
                    let data = discoveryV2.panels[i].firstPage.results[x];
                    if (data.linkCode == request.params.playlist) {
                        response.links[request.params.playlist] = data;
                    }
                }
            }*/
        } else {
            if (request.params.playlist) {
                for (let i = 0; i < discovery.Panels.length; i++) {
                    for (let z = 0; z < discovery.Panels[i].Pages.length; z++) {
                        for (let x in discovery.Panels[i].Pages[z].results) {
                            let linkData = discovery.Panels[i].Pages[z].results[x].linkData;
                            if (linkData.mnemonic == request.params.playlist) {
                                response.links[request.params.playlist] = linkData;
                            }
                        }
                    }
                }
            }
        }

        reply.status(200).send(response);
    });
}

module.exports = mnemonic;