async function creative(fastify, options) {
    fastify.get('/fortnite/api/discovery/accessToken/:branch', (request, reply) => {
        reply.status(200).send({
            "branchName": request.params.branch,
            "appId": "Fortnite",
            "token": "6liJ9OTYJpwtx0+jApUc/OYtq2eHDXFHTIp4nfJgduc="
        })
    })

    // idk the response
    fastify.get('/fortnite/api/game/v2/accolades/:islandCode/:islandVersion', (request, reply) => {
        reply.status(204).send();
    })

    // idk the response
    fastify.get('/fortnite/api/game/v2/creative/favorites/:accountId', (request, reply) => {
        reply.status(200).send([]);
    })

    // idk the response
    fastify.get('/fortnite/api/game/v2/creative/history/:accountId', (request, reply) => {
        reply.status(200).send({});
    })
}

module.exports = creative;