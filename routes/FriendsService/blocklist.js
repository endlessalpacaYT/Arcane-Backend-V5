const Friends = require("../../database/models/friends.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function blocklist(fastify, options) {
    // Block
    fastify.post('/friends/api/v1/:accountId/blocklist/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }
        friends.list.blocked.push({
            "accountId": userId,
            "created": new Date().toISOString()
        })
        await friends.save();

        reply.status(204).send();
    })

    // Clear
    fastify.delete('/friends/api/public/blocklist/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }
        friends.list.blocked = [];
        await friends.save();

        reply.status(204).send();
    })

    // List
    fastify.get('/friends/api/v1/:accountId/blocklist', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }

        reply.status(200).send(friends.list.blocked);
    })

    // Unblock
    fastify.delete('/friends/api/v1/:accountId/blocklist/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }
        const blocklist = friends.list.blocked;
        const index = blocklist.findIndex(blockedUser => blockedUser.accountId === userId);

        if (index === -1) {
            return createError.createError(errors.NOT_FOUND.user.not_found, 404, reply);
        }
        blocklist.splice(index, 1);
        await friends.save();

        reply.status(204).send();
    })
}

module.exports = blocklist;