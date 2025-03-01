async function guardians(fastify, options) {
    fastify.post('/account/api/public/guardians', (request, reply) => {
        return reply.status(204).send();
        
        reply.status(200).send({
            "id": "ArcaneV5",
            "guardianEmail": "developer@arcane.dev",
            "dateOfBirth": "2000-12-06",
            "country": "DE",
            "childAccountId": "ArcaneV5",
            "guardianAccountId": "ArcaneV5",
            "clientId": "ec684b8c687f479fadea3cb2ad83f5c6",
            "createdAt": new Date().toISOString(),
            "deadline": "9998-01-10T09:55:47.341Z",
            "completed": false,
            "guardianLastEmailed": "2022-12-11T09:55:47.350Z",
            "emailChallenged": false,
            "createdExternally": true
        })
    })

    // Create challenge route
    // idk what the response should look like
    fastify.post('/account/api/public/guardians/challenges', (request, reply) => {
        reply.status(204).send();
    })

    // Get guardian latest challenge
    fastify.get('/account/api/public/guardians/challenges', (request, reply) => {
        reply.status(200).send({
            "id": "ArcaneV5",
            "guardianEmail": "developer@arcane.dev",
            "createdAt": new Date().toISOString(),
            "lastNotification": {
                "sentAt": "2023-01-30T13:46:09.804Z",
                "canResendAt": "2023-01-31T13:46:09.804Z"
            },
            "completed": false
        });
    })

    // Send guardian challenge notification
    // idk the response
    fastify.post('/account/api/public/guardians/challenges/:challengeId/notifications', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = guardians;