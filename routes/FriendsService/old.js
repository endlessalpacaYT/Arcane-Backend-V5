const Friends = require("../../database/models/friends.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function old(fastify, options) {
    // Catagory: Blocklist

    // Block account
    fastify.get('/friends/api/public/blocklist/:accountId/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        friends.list.blocked.push({
            "accountId": userId,
            "created": new Date().toISOString()
        })
        await friends.save();

        reply.status(204).send();
    })

    // List
    fastify.get('/friends/api/public/blocklist/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const blocklist = friends.list.blocklist || [];
        const blockedUsers = blocklist.map(blocked => blocked.accountId);

        reply.status(200).send({
            "blockedUsers": blockedUsers
        })
    })

    // Unblock
    fastify.delete('/friends/api/public/blocklist/:accountId/:userId', { preHandler: tokenVerify }, async (request, reply) => {
        const { userId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
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

    // Catagory: Friends

    // Add
    fastify.post('/friends/api/public/friends/:accountId/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
        const { friendId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        let friend = await Friends.findOne({ accountId: friendId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friend) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        const incoming = friends.list.incoming;
        const index = incoming.findIndex(incomingRequest => incomingRequest.accountId === friendId);
        if (index !== -1) {
            friends.list.accepted.push({
                "accountId": friendId,
                "status": "ACCEPTED",
                "direction": "INBOUND",
                "groups": [],
                "mutual": 0,
                "alias": "",
                "note": "",
                "favorite": false,
                "created": new Date().toISOString()
            });
            friend.list.accepted.push({
                "accountId": accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "groups": [],
                "mutual": 0,
                "alias": "",
                "note": "",
                "favorite": false,
                "created": new Date().toISOString()
            });
            friends.list.incoming = friends.list.incoming.filter(request => request.accountId !== friendId);
            friend.list.outgoing = friend.list.outgoing.filter(request => request.accountId !== accountId);
        } else {
            friends.list.outgoing.push({
                "accountId": friendId,
                "status": "PENDING",
                "direction": "OUTBOUND",
                "groups": [],
                "mutual": 0,
                "alias": "",
                "note": "",
                "favorite": false,
                "created": new Date().toISOString()
            });
            friend.list.incoming.push({
                "accountId": accountId,
                "status": "PENDING",
                "direction": "INBOUND",
                "groups": [],
                "mutual": 0,
                "alias": "",
                "note": "",
                "favorite": false,
                "created": new Date().toISOString()
            });
        }
        await friends.save();
        await friend.save();

        reply.status(204).send();
    })

    // Remove
    fastify.delete('/friends/api/public/friends/:accountId/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
        const { friendId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        let friend = await Friends.findOne({ accountId: friendId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friend) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        friends.list.incoming = friends.list.incoming.filter(request => request.accountId !== friendId);
        friends.list.outgoing = friends.list.outgoing.filter(request => request.accountId !== friendId);
        friends.list.accepted = friends.list.accepted.filter(request => request.accountId !== friendId);

        friend.list.incoming = friend.list.incoming.filter(request => request.accountId !== accountId);
        friend.list.outgoing = friend.list.outgoing.filter(request => request.accountId !== accountId);
        friend.list.accepted = friend.list.accepted.filter(request => request.accountId !== accountId);

        await friends.save();
        await friend.save();

        reply.status(204).send();
    })

    // Clear friends list
    fastify.delete('/friends/api/public/friends/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        friends.list.accepted = [];
        await friends.save();
        
        reply.status(204).send();
    })

    // List
    fastify.get('/friends/api/public/friends/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        
        reply.status(200).send(friends.list.accepted)
    })
}

module.exports = old;