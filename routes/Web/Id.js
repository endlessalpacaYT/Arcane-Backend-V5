const { v4: uuidv4 } = require("uuid");

async function Id(fastify, options) {
    // Category Auth
    // SubCategory: DeviceCode

    // idk the response for this one
    fastify.post('/id/api/device/:userCode/activate', (request, reply) => {
        reply.status(204).send();
    })

    fastify.post('/id/api/device', (request, reply) => {
        reply.status(200).send({
            "userCode": "CVHWRDPZ",
            "expiresIn": 600,
            "interval": 10,
            "verificationUri": "https://www.epicgames.com/activate"
        })
    })

    fastify.get('/id/api/device/:userCode', (request, reply) => {
        reply.status(200).send({
            "clientId": "e49e067bb11c4722a34b2b3b8a6a6355",
            "prompt": "login",
            "state": {
                "flow": "quick"
            },
            "isLocal": true
        })
    })

    // SubCategory: ExchangeCode
    fastify.post('/id/api/exchange/generate', (request, reply) => {
        reply.status(200).send({
            "code": uuidv4()
        })
    })

    fastify.get('/id/api/exchange/:exchangeCode', (request, reply) => {
        reply.status(200).send({});
    })

    // SubCategory: Misc
    fastify.get('/id/api/continuation/:continuationToken', (request, reply) => {
        reply.status(200).send({
            "accountId": "ArcaneV5",
            "clientId": "xyza7891atVNaa9a4cJxNwHMzLUO65Ad"
        })
    })

    // gotta study this route!
    fastify.get('/id/api/redirect', (request, reply) => {
        if (request.query.redirectUrl) {
            reply.status(200).send({
                "redirectUrl": request.query.redirectUrl,
                "authorizationCode": null,
                "exchangeCode": "7d0dc2bc07e7463c9b44a711403862ba",
                "sid": null,
                "ssoV2Enabled": true
            });
        } else {
            reply.status(200).send({
                "redirectUrl": "https://localhost/launcher/authorized",
                "authorizationCode": null,
                "exchangeCode": "7d0dc2bc07e7463c9b44a711403862ba",
                "sid": null,
                "ssoV2Enabled": true
            });
        }
    })

    // Category: Misc
    fastify.get('/id/api/age-gate', (request, reply) => {
        reply.status(200).send({
            "country": "GB",
            "ageGateRequired": true,
            "ageOfConsent": 16,
            "ageRatingSystem": "PEGI"
        })
    })

    fastify.get('/id/api/analytics', (request, reply) => {
        reply.status(200).send({
            "trackingUuid": null,
            "accountId": null
        })
    })

    fastify.post('/id/api/analytics', (request, reply) => {
        reply.status(200).send({
            "trackingUuid": null,
            "accountId": null
        })
    })

    fastify.post('/id/api/client/:clientId/authorize', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get('/id/api/client/:clientId', (request, reply) => {
        reply.status(200).send({
            "clientId": request.params.clientId,
            "clientName": "launcherAppClient2",
            "redirectUrl": null,
            "internal": true,
            "mailingList": null,
            "native": false,
            "product": "default",
            "allowedScopes": [],
            "epicLoginOnly": false
        })
    })

    fastify.post('/id/api/login', (request, reply) => {
        reply.status(200).send();
    })

    fastify.post('/id/api/logout', (request, reply) => {
        reply.status(200).send({
            "sid": ""
        });
    })

    fastify.get('/id/api/location', (request, reply) => {
        reply.status(200).send({
            "country": "GB",
            "city": "Bridgwater",
            "coordinates": {
                "accuracy_radius": 20,
                "latitude": 50.1188,
                "longitude": 8.6843,
                "time_zone": "Europe/London"
            }
        });
    })

    fastify.get('/id/api/i18n', (request, reply) => {
        reply.status(304).send();
    })

    fastify.get('/id/api/authenticate', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = Id;