async function misc(fastify, options) {
    fastify.get('/library/api/public/items', (request, reply) => {
        reply.status(200).send({
            "responseMetadata": {
                "stateToken": "4c9f24ea-afdc-4de3-a95f-ae15bd439a48"
            },
            "records": [
                {
                    "namespace": "fn",
                    "catalogItemId": "48ff3f41680e403bb2717737f68731c5",
                    "appName": "Fortnite",
                    "productId": "prod-fn",
                    "sandboxName": "Fortnite",
                    "sandboxType": "PUBLIC",
                    "recordType": "APPLICATION",
                    "acquisitionDate": "2018-07-30T19:50:32.241Z",
                    "dependencies": []
                },
                {
                    "namespace": "fn",
                    "catalogItemId": "1e8bda5cfbb641b9a9aea8bd62285f73",
                    "appName": "Fortnite_Studio",
                    "productId": "prod-fn",
                    "sandboxName": "Fortnite",
                    "sandboxType": "PUBLIC",
                    "recordType": "APPLICATION",
                    "acquisitionDate": "2023-12-16T13:44:26.054Z",
                    "dependencies": []
                }
            ]
        })
    })

    fastify.get('/library/api/public/stateToken/:stateToken/status', (request, reply) => {
        reply.status(200).send({
            "valid": true
        })
    })
}

module.exports = misc;