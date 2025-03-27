const { v4: uuidv4 } = require("uuid");

const authorizationCode = require("../../database/models/authorizationCode");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function authenticationRoutes(fastify, options) {
    fastify.post("/admin/api/authentication/code", { preHandler: tokenVerify }, async (request, reply) => {
        const existingCode = await authorizationCode.findOne({ id: request.user.account_id });
        if (existingCode) {
            await existingCode.deleteOne();
        }
        
        const code = uuidv4().replace(/-/ig, "");
        
        const authCode = new authorizationCode({
            code: code,
            id: request.user.account_id,
            client_id: request.user.client_Id
        })
        await authCode.save();

        return reply.status(200).send({
            "redirectUrl": "",
            "authorizationCode": code,
            "exchangeCode": null,
            "sid": null,
            "ssoV2Enabled": true
        })
    })
}

module.exports = authenticationRoutes;