const Friends = require("../../database/models/friends.js");
const User = require("../../database/models/user.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function friends(fastify, options) {
    // Catagory: Uncatagorized

    // AcceptBulk
    fastify.post('/friends/api/v1/:accountId/incoming/accept', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }
        reply.status(200).send([])
    })

    // Clear friends list
    fastify.delete('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }
        friends.list.accepted = [];
        await friends.save();

        reply.status(204).send();
    })

    // Friends List
    fastify.get('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
        }

        reply.status(200).send(friends.list.accepted)
    })

    // Incoming friend requests
    fastify.get('/friends/api/v1/:accountId/incoming', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }

        reply.status(200).send(friends.list.incoming)
    })

    // Outgoing friend requests
    fastify.get('/friends/api/v1/:accountId/outgoing', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }

        reply.status(200).send(friends.list.outgoing)
    })

    // Suggested Friends
    fastify.get('/friends/api/v1/:accountId/suggested', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
        }

        reply.status(200).send(friends.list.suggested)
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
            if (user.accountInfo.id == accountId) {} else {
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
            "settings": {
                "acceptInvites": "public",
                "mutualPrivacy": "ALL"
            },
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
        reply.status(204).send();
    })

    // Remove alias
    fastify.delete('/friends/api/v1/:accountId/friends/:friendId/alias', { preHandler: tokenVerify }, async (request, reply) => {
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
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
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
        if (!friends) {
            friends = new Friends({
                created: new Date(),
                accountId: accountId
            });
            await friends.save();
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

    // not really sure what the response should be, prolly not worth doing idk
    fastify.get('/friends/api/public/list/fortnite/:accountId/recentPlayers', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = friends;