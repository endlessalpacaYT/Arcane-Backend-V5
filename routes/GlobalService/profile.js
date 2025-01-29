async function profile(fastify, options) {
    fastify.put('/profile/languages', (request, reply) => {
        reply.status(200).send({})
    })

    fastify.put('/profile/privacy_settings', (request, reply) => {
        reply.status(200).send({
            "privacySettings": {
                "playRegion": "PUBLIC",
                "badges": "PUBLIC",
                "languages": "PUBLIC"
            }
        })
    })

    fastify.post('/profile/privacy_settings', (request, reply) => {
        reply.status(200).send({
            "privacySettings": {
                "playRegion": "PUBLIC",
                "badges": "PUBLIC",
                "languages": "PUBLIC"
            }
        })
    })

    fastify.put('/profiles', (request, reply) => {
        reply.status(200).send({
            "profiles": [
                {
                    "accountId": "ArcaneV5",
                    "hasBattlePass": false,
                    "playRegion": "EUROPE",
                    "hasCrewMembership": false,
                    "languages": ["en"],
                    "seasonLevel": 0
                }
            ]
        })
    })

    fastify.put('/profile/play_region', (request, reply) => {
        const { namespace, play_region } = request.body;
        reply.status(200).send({
            "namespace": namespace,
            "play_region": play_region
        })
    })
}

module.exports = profile;