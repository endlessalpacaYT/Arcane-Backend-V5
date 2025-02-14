const Friends = require("../../database/models/friends.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const friendManager = require("../../utils/friends.js");
const functions = require("../../utils/functions.js");

async function old(fastify, options) {
    // Catagory: Blocklist

    // Block account
    fastify.get('/friends/api/public/blocklist/:accountId/:userId', { preHandler: tokenVerify }, async (request, reply) => {
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

    fastify.post('/friends/api/public/blocklist/:accountId/:userId', { preHandler: tokenVerify }, async (request, reply) => {
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
        let sender = await Friends.findOne({ accountId: accountId });
        let receiver = await Friends.findOne({ accountId: userId });
        if (!sender || !receiver) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!await friendManager.deleteFriend(sender.accountId, receiver.accountId)) return reply.status(403).send();

        reply.status(204).send();
    })

    // Catagory: Friends

    // Add
    fastify.post('/friends/api/public/friends/:accountId/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
        const { friendId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        let friend = await Friends.findOne({ accountId: friendId });
        if (!friends || !friend) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        if (friends.list.incoming.find(i => i.accountId == friend.accountId)) {
            if (!await friendManager.acceptFriendReq(friends.accountId, friend.accountId)) return reply.status(403).send();

            functions.getPresenceFromUser(friends.accountId, friend.accountId, false);
            functions.getPresenceFromUser(friend.accountId, friends.accountId, false);
        } else if (!friends.list.outgoing.find(i => i.accountId == friend.accountId)) {
            if (!await friendManager.sendFriendReq(friends.accountId, friend.accountId)) return reply.status(403).send();
        }

        reply.status(204).send();
    })

    // Remove
    fastify.delete('/friends/api/public/friends/:accountId/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
        const { friendId } = request.params;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        let friend = await Friends.findOne({ accountId: friendId });
        if (!friends || !friend) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        if (!await friendManager.deleteFriend(friends.accountId, friend.accountId)) return reply.status(403).send();

        functions.getPresenceFromUser(friends.accountId, friend.accountId, true);
        functions.getPresenceFromUser(friend.accountId, friends.accountId, true);


        reply.status(204).send();
    })

    // Clear friends list
    fastify.delete('/friends/api/public/friends/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        friendManager.clearFriends(accountId);

        reply.status(204).send();
    })

    // List
    fastify.get('/friends/api/public/friends/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        let response = [];
        let dbUpdated = false;

        friends.list.accepted.forEach(acceptedFriend => {
            if (!acceptedFriend.favorite) {
                acceptedFriend.favorite = false;
                dbUpdated = true;
            }
            response.push({
                "accountId": acceptedFriend.accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "created": acceptedFriend.created,
                "favorite": acceptedFriend.favorite
            });
        });

        friends.list.incoming.forEach(incomingFriend => {
            if (!incomingFriend.favorite) {
                incomingFriend.favorite = false;
                dbUpdated = true;
            }
            response.push({
                "accountId": incomingFriend.accountId,
                "status": "PENDING",
                "direction": "INBOUND",
                "created": incomingFriend.created,
                "favorite": incomingFriend.favorite
            });
        });

        friends.list.outgoing.forEach(outgoingFriend => {
            if (!outgoingFriend.favorite) {
                outgoingFriend.favorite = false;
                dbUpdated = true;
            }
            response.push({
                "accountId": outgoingFriend.accountId,
                "status": "PENDING",
                "direction": "OUTBOUND",
                "created": outgoingFriend.created,
                "favorite": outgoingFriend.favorite
            });
        });

        if (dbUpdated) {
            await friends.save();
        }

        reply.status(200).send(response)
    })
}

module.exports = old;