async function entitlement(fastify, options) {
    fastify.get('/entitlement/api/account/:accountId/entitlements', (request, reply) => {
        reply.status(200).send([
            {
                "id": "b52656d3505c425cb537d48f6c5103d0",
                "entitlementName": "Fortnite_Free",
                "namespace": "fn",
                "catalogItemId": "48ff3f41680e403bb2717737f68731c5",
                "accountId": request.params.accountId,
                "identityId": request.params.accountId,
                "entitlementType": "ENTITLEMENT",
                "grantDate": "2018-07-30T19:50:32.241Z",
                "consumable": false,
                "status": "ACTIVE",
                "active": true,
                "useCount": 0,
                "originalUseCount": 0,
                "platformType": "EPIC",
                "created": "2018-07-30T19:50:32.245Z",
                "updated": "2018-07-30T19:50:32.245Z",
                "groupEntitlement": false,
                "readFromCache": false
            }
        ]);
    })
}

module.exports = entitlement;