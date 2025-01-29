const User = require("../../database/models/user");

async function eosServices(fastify, options) {
    fastify.post('/auth/v1/oauth/token', async (request, reply) => {
        let user = await User.findOne({ "accountInfo.email": `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev` });
        if (!user) {
            user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
        }

        reply.status(200).send({
            "access_token": "eg1~ArcaneV5",
            "token_type": "bearer",
            "expires_at": new Date(Date.now() + 3599 * 1000).toISOString(),
            "nonce": request.body.nonce,
            "features": [
                "AntiCheat",
                "Connect",
                "ContentService",
                "Ecom",
                "Inventories",
                "LockerService",
                "Matchmaking Service"
            ],
            "organization_id": "ArcaneV5",
            "product_id": "prod-fn",
            "sandbox_id": "fn",
            "deployment_id": "62a9473a2dca46b29ccf17577fcf42d7",
            "organization_user_id": user.accountInfo.id,
            "product_user_id": user.accountInfo.id,
            "product_user_id_created": false,
            "id_token": "eg1~ArcaneV5",
            "expires_in": 3599
        })
    })

    fastify.get('/api/inventory/v3/:deploymentId/players/:productUserId/:inventoryName', (request, reply) => {
        reply.status(200).send({
            "binary": null,
            "inventory": {
                "playerId": "ArcaneV5",
                "inventoryName": request.params.inventoryName,
                "prefix": "/",
                "instance": "00000000-0000-0000-0000-000000000000",
                "contents": {
                    "/accoladecollection30": "{\\\"pfwaccoladecollection_module\\\":{}}",
                    "/accoladecollection30.meta": "{\\\"version\\\":1,\\\"serializer\\\":\\\"JsonObjectAsSingleString\\\"}"
                }
            },
            "continuationToken": null
        })
    })

    fastify.get("/epic/id/v2/sdk/accounts", async (request, reply) => {
        let user = await User.findOne({ "accountInfo.id": request.query.accountId });
        if (!user) {
            reply.status(400).send();
            //user = botDatabase.createUser(process.env.DISPLAYNAME, process.env.PASSWORD, `${process.env.DISPLAYNAME.toLowerCase()}@arcane.dev`)
        }

        reply.status(200).send([
            {
                "accountId": request.query.accountId,
                "displayName": user.accountInfo.displayName,
                "preferredLanguage": "en",
                "linkedAccounts": [],
                "cabinedMode": false,
                "empty": false
            }
        ]);
    })
}

module.exports = eosServices;