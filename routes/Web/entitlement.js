async function entitlement(fastify, options) {
    fastify.get('/entitlement/api/account/:accountId/entitlements', (request, reply) => {
        reply.status(200).send([]);
    })
}

module.exports = entitlement;