const Friends = require("../../database/models/friends.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function settings(fastify, options) {
    // Catagory: ExternalSourceSettings
    fastify.get('/friends/api/v1/:accountId/settings/externalSources/:source', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friends.settings.externalSourceSettings) {
            friends.settings.externalSourceSettings = {};
            await friends.save();
        }
        reply.status(200).send(friends.settings.externalSourceSettings)
    })

    fastify.put('/friends/api/v1/:accountId/settings/externalSources/:source', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friends.settings.externalSourceSettings) {
            friends.settings.externalSourceSettings = {};
        }
        friends.settings.externalSourceSettings = request.body;
        await friends.save();
        reply.status(200).send(friends.settings.externalSourceSettings)
    })

    // Catagory: PrivacySettings
    fastify.get('/friends/api/v1/:accountId/settings', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friends.settings.privacySettings) {
            friends.settings.privacySettings = {};
            await friends.save();
        }
        reply.status(200).send(friends.settings.privacySettings)
    })

    fastify.patch('/friends/api/v1/:accountId/settings', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friends.settings.privacySettings) {
            friends.settings.privacySettings = {};
        }
        friends.settings.privacySettings = request.body;
        await friends.save();
        reply.status(200).send(friends.settings.privacySettings)
    })

    // Deprecated (changed to patch (the route above))
    fastify.put('/friends/api/v1/:accountId/settings', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        let friends = await Friends.findOne({ accountId: accountId });
        if (!friends) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!friends.settings.privacySettings) {
            friends.settings.privacySettings = {};
        }
        friends.settings.privacySettings = request.body;
        await friends.save();
        reply.status(200).send(friends.settings.privacySettings)
    })
}

module.exports = settings;