async function hotconfig(fastify, options) {
    fastify.get('/hotconfigs/v2/:filename', (request, reply) => {
        if (request.params.filename == "livefn") {
            reply.status(200).send(require("../../responses/fortniteConfig/hotconfigs/livefn.json"));
        } else {
            reply.status(404).send();
        }
    })
}

module.exports = hotconfig;