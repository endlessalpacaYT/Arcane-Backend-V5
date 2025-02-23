const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");

async function mnemonic(fastify, options) {
    fastify.post("/links/api/fn/mnemonic", async (request, reply) => {
        let MnemonicArray = [];

        for (let x = 0; x < discovery.Panels.length; x++) {
            for (let z = 0; z < discovery.Panels[x].Pages.length; z++) {
                for (let i in discovery.Panels[x].Pages[z].results) {
                    MnemonicArray.push(discovery.Panels[x].Pages[z].results[i].linkData)
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

        reply.status(200).send(response);
    });
}

module.exports = mnemonic;