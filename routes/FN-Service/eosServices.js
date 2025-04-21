const User = require("../../database/models/user");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

async function eosServices(fastify, options) {
    fastify.post('/auth/v1/oauth/token', async (request, reply) => {
        const { grant_type } = request.body;
        
        if (grant_type == "client_credentials") {
            return reply.status(200).send({
                "access_token": uuidv4().replace(/-/ig, "").toUpperCase(),
                "token_type": "bearer",
                "expires_at": "9998-04-06T18:36:16.533Z",
                "features": [
                    "AntiCheat",
                    "Connect",
                    "ContentService",
                    "Ecom",
                    "EpicConnect",
                    "Inventories",
                    "LockerService",
                    "Matchmaking Service"
                ],
                "organization_id": uuidv4().replace(/-/ig, "").toUpperCase(),
                "product_id": "prod-fn",
                "sandbox_id": "fn",
                "deployment_id": request.body.deployment_id,
                "expires_in": 3599
            })
        } else if (grant_type == "external_auth") {
            return reply.status(200).send({
                "access_token": uuidv4().replace(/-/ig, "").toUpperCase(),
                "token_type": "bearer",
                "expires_at": "9998-04-06T18:36:16.533Z",
                "features": [
                    "AntiCheat",
                    "Connect",
                    "ContentService",
                    "Ecom",
                    "EpicConnect",
                    "Inventories",
                    "LockerService",
                    "Matchmaking Service"
                ],
                "organization_id": uuidv4().replace(/-/ig, "").toUpperCase(),
                "product_id": "prod-fn",
                "sandbox_id": "fn",
                "deployment_id": request.body.deployment_id,
                "expires_in": 3599
            })
        }
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