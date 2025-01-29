const tokenVerify = require("../../middlewares/tokenVerify.js");

async function account(fastify, options) {
    fastify.get('/persona/api/public/account/lookup', { preHandler: tokenVerify }, (request, reply) => {
        reply.status(200).send({
            "id": request.user.account_id,
            "displayName": request.user.displayName
        })
    })
}

module.exports = account;