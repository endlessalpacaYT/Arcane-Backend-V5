async function status(fastify, options) {
    fastify.get('/lightswitch/api/service/:serviceId/status', (request, reply) => {
        reply.status(200).send({
            "serviceInstanceId": "fortnite",
            "status": "UP",
            "message": "Fortnite is online",
            "maintenanceUri": null,
            "overrideCatalogIds": ["a7f138b2e51945ffbfdacc1af0541053"],
            "allowedActions": [],
            "banned": false,
            "launcherInfoDTO": {
                "appName": "Fortnite",
                "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                "namespace": "fn"
            }
        });
    });
}

module.exports = status;