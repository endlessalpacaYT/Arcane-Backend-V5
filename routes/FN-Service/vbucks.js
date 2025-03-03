require("dotenv").config();

const Profile = require("../../database/models/profile.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function vbucks(fastify, options) {
    fastify.post('/fortnite/api/v1/profile/:accountId/vbucks/add', async (request, reply) => {
        const { accountId } = request.params;
        const { reason, apiKey } = request.body;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!apiKey || apiKey != process.env.JWT_SECRET) {
            return reply.status(403).send()
        }

        const profile = profiles.profiles["common_core"];

        let statChanged = false;

        const beforeChanges = profile.items["Currency:MtxPurchased"].quantity;

        try {
            if (reason == "kill") {
                profile.items["Currency:MtxPurchased"].quantity += 10;
                statChanged = true;
            } else if (reason == "win") {
                profile.items["Currency:MtxPurchased"].quantity += 40;
                statChanged = true;
            } else {
                console.warn(`Unexpected Vbucks Reason: ${reason}`);
                profile.items["Currency:MtxPurchased"].quantity += 5;
                statChanged = true;
            }
        } catch (err) {
            console.error(`Error In Vbucks: ${err}`);
            profile.items["Currency:MtxPurchased"].quantity += 5;
            statChanged = true;
        }

        if (statChanged) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.common_core`]: profile } });
        }

        const afterChanges = profile.items["Currency:MtxPurchased"].quantity;

        reply.status(200).send({
            status: "success",
            beforeChanges: beforeChanges,
            afterChanges: afterChanges
        })
    })

    fastify.get('/fortnite/api/v1/profile/:accountId/vbucks/get', async (request, reply) => {
        const { accountId } = request.params;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const profile = profiles.profiles["common_core"];

        return reply.status(200).send({
            vbucks: profile.items["Currency:MtxPurchased"].quantity
        })
    })
}

module.exports = vbucks;