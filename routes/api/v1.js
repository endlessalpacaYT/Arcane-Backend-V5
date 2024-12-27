async function v1(fastify, options) {
    fastify.get('/v1/launcher/servers/status', (request, reply) => {
        reply.status(200).send({
            "SERVER_STATUS": "offline",
            "LAUNCHER_STATUS": "offline"
        })
    })

    fastify.get('/v1/launcher/update/fetch', (request, reply) => {
        reply.status(200).send({
            "updatelink": "https://cdn.evolvefn.com/launcher/EvolveLauncher_1.0.13_EN_US.exe"
        })
    })

    fastify.get('/v1/launcher/update/currentversion', (request, reply) => {
        reply.status(200).send({
            "LAUNCHER_VERSION": "1.0.1"
        })
    })
}

module.exports = v1;