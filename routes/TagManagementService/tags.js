const tagList = require("../../responses/fortniteConfig/TagManagementService/tags.json");

async function tags(fastify, options) {
    fastify.get('/api/v1/public/accounts/:accountId/tags', (request, reply) => {
        reply.status(200).send({
            "tags": [
                {
                    "id": "c8eaf7c8365f478e99a20ff70a83e689",
                    "name": "BR - Trios",
                    "types": ["Game Modes"],
                    "primary": false,
                    "locale": "en-US",
                    "defaultLocaleName": "BR - Trios"
                },
                {
                    "id": "9614aa25267041ad8c7d6e17296fdc65",
                    "name": "BR - Squads",
                    "types": ["Game Modes"],
                    "primary": false,
                    "locale": "en-US",
                    "defaultLocaleName": "BR - Squads"
                },
                {
                    "id": "d9e00ab236c343268ebc1fe479b960e6",
                    "name": "BR - Duos",
                    "types": ["Game Modes"],
                    "primary": false,
                    "locale": "en-US",
                    "defaultLocaleName": "BR - Duos"
                }
            ]
        })
    })

    fastify.get('/api/v1/public/tags', (request, reply) => {
        if (request.query.cursor) {
            tagList.cursor = request.query.cursor;
        } else { tagList.cursor = null; }
        reply.status(200).send(tagList);
    })

    fastify.put('/api/v1/public/accounts/:accountId/tags', (request, reply) => {
        reply.status(200).send({
            "tags": [
                {
                    "id": "d9e00ab236c343268ebc1fe479b960e6",
                    "name": "BR - Duos",
                    "types": ["Game Modes"],
                    "primary": false,
                    "locale": "en-US",
                    "defaultLocaleName": "BR - Duos"
                }
            ]
        })
    })

    fastify.get('/api/v1/public/accounts', (request, reply) => {
        reply.status(200).send({
            "accounts": [
                {
                    "accountId": "ArcaneV5",
                    "tags": [
                        {
                            "id": "c8eaf7c8365f478e99a20ff70a83e689",
                            "name": "BR - Trios",
                            "types": ["Game Modes"],
                            "primary": false,
                            "locale": "en-US",
                            "defaultLocaleName": "BR - Trios"
                        },
                        {
                            "id": "9614aa25267041ad8c7d6e17296fdc65",
                            "name": "BR - Squads",
                            "types": ["Game Modes"],
                            "primary": false,
                            "locale": "en-US",
                            "defaultLocaleName": "BR - Squads"
                        },
                        {
                            "id": "d9e00ab236c343268ebc1fe479b960e6",
                            "name": "BR - Duos",
                            "types": ["Game Modes"],
                            "primary": false,
                            "locale": "en-US",
                            "defaultLocaleName": "BR - Duos"
                        }
                    ]
                }
            ]
        })
    })
}

module.exports = tags;