const discovery = require("../../responses/fortniteConfig/discovery/discovery.json");

async function mnemonic(fastify, options) {
    fastify.get('/links/api/:namespace/mnemonic/:mnemonic', (request, reply) => {
        for (let i in discovery.Panels[0].Pages[0].results) {
            if (discovery.Panels[0].Pages[0].results[i].linkData.mnemonic == request.params.mnemonic) {
                reply.status(200).send(discovery.Panels[0].Pages[0].results[i].linkData);
            }
        }
    })

    fastify.post('/links/api/:namespace/mnemonic', (request, reply) => {
        /*let MnemonicArray = [];

        for (let i in discovery.Panels[0].Pages[0].results) {
            MnemonicArray.push(discovery.Panels[0].Pages[0].results[i].linkData)
        }

        reply.status(200).send(MnemonicArray);*/
        reply.status(200).send(require("./g.json"));
    })

    fastify.get('/links/api/:namespace/mnemonic/:mnemonic/related', (request, reply) => {
        /*let response = {
            "parentLinks": [],
            "links": {}
        };
    
        if (request.params.mnemonic) {
            for (let i in discovery.Panels[0].Pages[0].results) {
                let linkData = discovery.Panels[0].Pages[0].results[i].linkData;
                if (linkData.mnemonic == request.params.mnemonic) {
                    response.links[request.params.mnemonic] = linkData;
                }
            }        
        }    
    
        reply.status(200).send(response);*/
        reply.status(200).send(require("./r.json"));
    })
}

module.exports = mnemonic;