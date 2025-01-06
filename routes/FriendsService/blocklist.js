const Friends = require("../../database/models/friends.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function blocklist(fastify, options) {
    // Block
    fastify.post('/friends/api/v1/:accountId/blocklist/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let sender = await Friends.findOne({ accountId: accountId });
        let receiver = await Friends.findOne({ accountId: userId });
        if (!sender || !receiver) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!await friendManager.blockFriend(sender.accountId, receiver.accountId)) return reply.status(403).send();

        functions.getPresenceFromUser(sender.accountId, receiver.accountId, true);
        functions.getPresenceFromUser(receiver.accountId, sender.accountId, true);

        reply.status(204).send();
    })

    // Clear
    fastify.delete('/friends/api/public/blocklist/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        friends.list.blocked = [];
        await user.save();
        reply.status(204).send();
    })

    // List
    fastify.get('/friends/api/v1/:accountId/blocklist', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(friends.list.blocked);
    })

    // Unblock
    fastify.delete('/friends/api/v1/:accountId/blocklist/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let sender = await Friends.findOne({ accountId: accountId });
        let receiver = await Friends.findOne({ accountId: userId });
        if (!sender || !receiver) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!await friendManager.deleteFriend(sender.accountId, receiver.accountId)) return reply.status(403).send();

        reply.status(204).send();
    })
}

module.exports = blocklist;