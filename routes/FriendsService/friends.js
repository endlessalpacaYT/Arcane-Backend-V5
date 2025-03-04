const Friends = require("../../database/models/friends.js");
const User = require("../../database/models/user.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const friendManager = require("../../utils/friends.js");
const functions = require("../../utils/functions.js");

async function friends(fastify, options) {
    // Catagory: Uncatagorized

    // AcceptBulk
    fastify.post('/friends/api/v1/:accountId/incoming/accept', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send([])
    })

    // Clear friends list
    fastify.delete('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        friendManager.clearFriends(accountId);

        reply.status(204).send();
    })

    // Friends List
    fastify.get('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });

        reply.status(200).send(friends.list.accepted)
    })

    // Incoming friend requests
    fastify.get('/friends/api/v1/:accountId/incoming', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });

        reply.status(200).send(friends.list.incoming)
    })

    // Outgoing friend requests
    fastify.get('/friends/api/v1/:accountId/outgoing', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });

        reply.status(200).send(friends.list.outgoing)
    })

    // Suggested Friends
    fastify.get('/friends/api/v1/:accountId/suggested', { preHandler: tokenVerify }, async (request, reply) => {
        const users = await User.find();
        let suggested = [];

        users.forEach(user => {
            if (user.accountInfo.id == accountId) { } else {
                suggested.push({
                    "accountId": user.accountInfo.id,
                    "mutual": 0,
                    "created": new Date().toISOString()
                })
            }
        });

        reply.status(200).send(suggested)
    })

    // Summary
    fastify.get('/friends/api/v1/:accountId/summary', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        const users = await User.find();
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }
        let suggested = [];

        users.forEach(user => {
            const isFriend = friends.list.accepted.findIndex(i => i.accountId == user.accountInfo.id)
            if (user.accountInfo.id == accountId || user.accountInfo.id == global.botId || isFriend != -1) { } else {
                suggested.push({
                    "accountId": user.accountInfo.id,
                    "mutual": 0,
                    "created": new Date().toISOString()
                })
            }
        });

        reply.status(200).send({
            "friends": friends.list.accepted,
            "incoming": friends.list.incoming,
            "outgoing": friends.list.outgoing,
            "suggested": suggested,
            "blocklist": friends.list.blocked,
            "settings": friends.settings,
            "limitsReached": {
                "incoming": false,
                "outgoing": false,
                "accepted": false
            }
        })
    })

    // Catagory: Friend

    // Edit alias
    fastify.put('/friends/api/v1/:accountId/friends/:friendId/alias', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await Friends.findOne({ accountId: accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const index = user.list.accepted.findIndex(i => i.accountId == request.params.friendId);
        if (index == -1) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        } else {
            user.list.accepted[index].alias = request.body;
            await user.updateOne({ $set: { list: user.list } });
        }

        reply.status(204).send();
    })

    // Remove alias
    fastify.delete('/friends/api/v1/:accountId/friends/:friendId/alias', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await Friends.findOne({ accountId: accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const index = user.list.accepted.findIndex(i => i.accountId == request.params.friendId);
        if (index == -1) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        } else {
            user.list.accepted[index].alias = "";
            await user.updateOne({ $set: { list: user.list } });
        }

        reply.status(204).send();
    })

    // Set note
    fastify.put('/friends/api/v1/:accountId/friends/:friendId/note', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(204).send();
    })

    // Remove note
    fastify.delete('/friends/api/v1/:accountId/friends/:friendId/note', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(204).send();
    })

    // Add
    fastify.post('/friends/api/v1/:accountId/friends/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
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
    });

    // Friendship info
    fastify.get('/friends/api/v1/:accountId/friends/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
        const { friendId } = request.body;
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }
        const accepted = friends.list.accepted;
        const index = accepted.findIndex(accepted => accepted.accountId === friendId);
        const friendInfo = friends.list.accepted[index];

        reply.status(200).send(friendInfo)
    })

    // Mutual
    fastify.get('/friends/api/v1/:accountId/friends/:friendId/mutual', (request, reply) => {
        reply.status(200).send([])
    })

    // Decline Incoming / Cancel Outgoing / Remove Friend
    fastify.delete('/friends/api/v1/:accountId/friends/:friendId', { preHandler: tokenVerify }, async (request, reply) => {
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

    // not really sure what the response should be, prolly not worth doing idk
    fastify.get('/friends/api/public/list/fortnite/:accountId/recentPlayers', (request, reply) => {
        reply.status(200).send([]);
    })

    fastify.get('/friends/api/v1/:accountId/recent/fortnite', (request, reply) => {
        reply.status(200).send([]);
    })

    // Please somebody tell me what this route does?????
    fastify.get('/api/v2/interactions/*', (request, reply) => {
        reply.status(200).send({});
    })
}

module.exports = friends;