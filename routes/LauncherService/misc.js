async function misc(fastify, options) {
    fastify.get('/launcher/api/public/distributionpoints', (request, reply) => {
        reply.status(200).send({
            "distributions": [
                "https://cloudflare.epicgamescdn.com/",
                "https://download.epicgames.com/",
                "https://fastly-download.epicgames.com/",
                "https://epicgames-download1.akamaized.net/"
            ]
        })
    })

    fastify.get('/launcher/api/public/distributionpoints/', (request, reply) => {
        reply.status(200).send({
            "distributions": [
                "https://cloudflare.epicgamescdn.com/",
                "https://download.epicgames.com/",
                "https://fastly-download.epicgames.com/",
                "https://epicgames-download1.akamaized.net/"
            ]
        })
    })

    // idfk the respoonse
    fastify.get('/launcher/api/installer/download/:app', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/v1/features', (request, reply) => {
        reply.status(200).send(require("../../responses/EpicConfig/features.json"));
    })
}

module.exports = misc;