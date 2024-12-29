async function v1(fastify, options) {
    fastify.get('/v1/launcher/servers/status', (request, reply) => {
        reply.status(200).send({
            "SERVER_STATUS": "online",
            "LAUNCHER_STATUS": "online"
        })
    })

    fastify.get('/v1/launcher/update/fetch', (request, reply) => {
        reply.status(200).send({
            "updatelink": "https://cdn.evolvefn.com/launcher/EvolveLauncher_1.0.14_en-US.exe"
        })
    })

    fastify.get('/v1/launcher/update/currentversion', (request, reply) => {
        reply.status(200).send({
            "LAUNCHER_VERSION": "1.0.2"
        })
    })

    fastify.get('/v1/launcher/build/info', (request, reply) => {
        reply.status(200).send({
            "build": "4.5",
            "download": "downloadlink",
            "available": true,
            "image": "https://cdn.evolvefn.com/Seasonal%20Images/4.jpg",
            "buildslogan": "Brace For Impact",
            "buildmessage": "Fortnite Season 4 was the fourth season of Fortnite Battle Royale, featuring a rocket event with the slogan being 'Brace for Impact'."
        })
    })
}

module.exports = v1;