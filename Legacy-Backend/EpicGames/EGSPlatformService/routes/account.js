async function account(fastify, options) {
    // Catagory: Uncatagorized
    fastify.get('/api/v1/private/egs/account/wallet', (request, reply) => {
        reply.status(200).send({
            "__typename": "Wallet",
            "coupons": {
                "count": 0
            },
            "epicRewards": {
                "__typename": "EpicRewardsSupported",
                "balance": "£0.00",
                "rawBalance": 963
            },
            "wallet": {
                "__typename": "EpicWalletSupported",
                "balance": "£0.00"
            }
        })
    })

    fastify.get('/api/v1/private/egs/library/subscriptions/ea/time-trial/:sandboxId/:catalogItemId', (request, reply) => {
        reply.status(200).send(null);
    })

    // Catagory: Parental Controls
    fastify.post('/api/v1/private/egs/account/content-controls/verify-pin', (request, reply) => {
        reply.status(200).send({
            "status": "Success"
        })
    })

    fastify.get('/content-controls/*', (request, reply) => {
        reply.status(200).send({});
    })

    // Catagory: Subscriptions
    fastify.get('/api/v1/private/egs/products/:productId/offers/:offerId/subscriptions/benefits', (request, reply) => {
        reply.status(200).send({
            "applicableBenefits": [],
            "offerId": "9ec21a8d4f744f8b938fbf79d02d40b9",
            "sandboxId": "fn"
        })
    })

    // idk the response
    fastify.post('/api/v1/private/egs/account/subscriptions/claim-benefit', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/api/v1/private/egs/account/subscriptions', (request, reply) => {
        reply.status(200).send({
            "paging": {
                "count": 0,
                "start": 0,
                "total": 0
            },
            "subscriptions": []
        })
    })
}

module.exports = account;