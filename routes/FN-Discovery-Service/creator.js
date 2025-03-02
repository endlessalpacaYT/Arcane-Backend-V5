async function creator(fastify, options) {
    fastify.get('/api/v1/creator/page/:creatorAccountId', (request, reply) => {
        reply.status(200).send({
            "creatorId": "epic",
            "links": [],
            "hasMore": false
        })
    })

    fastify.get('/page/v1/:creator', (request, reply) => {
        if (request.params.creator == "epic") {
            reply.status(200).send({
                "isFollowed": false,
                "displayName": "Epic Games",
                "surfaceName": "CreativeDiscoverySurface_EpicPage",
                "bio": "Play Fortnite your way. Choose an island and drop in!",
                "images": {
                    "avatar": "https://cdn2.unrealengine.com/epicgames-cretorprofile-192x192-cd5708661249.jpg",
                    "banner": "https://cdn2.unrealengine.com/epic-creator-profile-no-logo-2800x960-b1cee1ac257e.jpg"
                },
                "social": {
                    "youtube": "fortnite",
                    "tikTok": "@fortnite",
                    "twitter": "FortniteGame",
                    "discord": "fortnite",
                    "instagram": "fortnite"
                }
            })
        }
    })
}

module.exports = creator;