const Friends = require("../../database/models/friends.js");
const User = require("../../database/models/user.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function friends(fastify, options) {
    // Catagory: Uncatagorized

    // AcceptBulk
    fastify.post('/friends/api/v1/:accountId/incoming/accept', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send([])
    })

    // Clear friends list
    fastify.delete('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(204).send();
    })

    // Friends List
    fastify.get('/friends/api/v1/:accountId/friends', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send(friends.list.accepted)
    })

    // Incoming friend requests
    fastify.get('/friends/api/v1/:accountId/incoming', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send()
    })

    // Outgoing friend requests
    fastify.get('/friends/api/v1/:accountId/outgoing', { preHandler: tokenVerify }, async (request, reply) => {
        reply.status(200).send()
    })

    // Suggested Friends
    fastify.get('/friends/api/v1/:accountId/suggested', { preHandler: tokenVerify }, async (request, reply) => {
        const users = await User.find();
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
        friends.list.accepted.push({
            accountId: global.botId,
            groups: [],
            alias: "",
            note: "",
            favorite: false,
            created: new Date().toISOString()
        })

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
        reply.status(204).send();
    })

    // not really sure what the response should be, prolly not worth doing idk
    fastify.get('/friends/api/public/list/fortnite/:accountId/recentPlayers', (request, reply) => {
        reply.status(204).send();
    })
}

module.exports = friends;