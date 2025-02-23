const { request } = require("express");

async function misc(fastify, options) {
    fastify.get('/followers/api/v1/FortniteLive/:accountId/followed', (request, reply) => {
        reply.status(200).send({
            "followed": []
        })
    })

    fastify.get('/api/v1/lfg/Fortnite/users/:accountId/settings', (request, reply) => {
        reply.status(200).send({
            "isLookingForGroup": true,
            "preferredRegion": "EU"
        })
    })

    fastify.patch('/api/v1/lfg/Fortnite/users/:accountId/settings', (request, reply) => {
        reply.status(200).send({
            "isLookingForGroup": true,
            "preferredRegion": "EU"
        })
    })
}

module.exports = misc;