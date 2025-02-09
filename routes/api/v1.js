async function v1(fastify, options) {
    fastify.get('/v1/launcher/servers/status', (request, reply) => {
        reply.status(200).send({
            "SERVER_STATUS": "online",
            "LAUNCHER_STATUS": "online"
        })
    })

    fastify.get('/v1/launcher/update/fetch', (request, reply) => {
        reply.status(200).send({
            "updatelink": ""
        })
    })

    fastify.get('/v1/launcher/update/currentversion', (request, reply) => {
        reply.status(200).send({
            "LAUNCHER_VERSION": "1.0.7",
            "LAUNCHER_V2_VERSION": "0.2.1"
        })
    })

    fastify.get('/v1/launcher/build/info', (request, reply) => {
        reply.status(200).send({
            "build": "5.30",
            "download": "downloadlink",
            "available": true,
            "image": "https://cdn.evolvefn.com/Seasonal%20Images/5.jpg",
            "buildslogan": "World's Collide",
            "buildmessage": "Fortnite Season 5 was the fifth season of Battle Royale, with loads of content to play with."
        })
    })

    fastify.get('/api/v1/launcher/posts/', (request, reply) => {
        reply.status(200).send({
            "new": true,
            "date": "09/02/25",
            "author": "abztrc",
            "tags": "NEW, SEASON 8, RELEASE",
            "body": "",
            "title": "",
            "position": "1",
            "available": true
        })
    })
}

module.exports = v1;