require("dotenv").config();

const Profile = require("../../database/models/profile.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function quest(fastify, options) {
    fastify.get('/fortnite/api/v1/profile/:accountId/quests/query', async (request, reply) => {
        const { accountId } = request.params;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const profile = profiles.profiles["athena"];

        let quests = [];

        for (let item of Object.values(profile.items)) {
            let templateId = item.templateId;
            if (templateId.includes("Quest")) {
                quests.push(templateId)
            } else if (templateId.includes("Challenge")) {
                //quests.push(templateId);
            } else {}
        }

        reply.status(200).send(quests);
    })

    fastify.post('/fortnite/api/v1/profile/:accountId/quests/addCompletion', { preHandler: tokenVerify }, async (request, reply) => {
        const { accountId } = request.params;
        const { templateId, progress } = request.body;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const profile = profiles.profiles["athena"];
        const items = profile.items;

        let questItem;
        for (let item of Object.values(items)) {
            item = item.templateId;
            if (item.includes(templateId)) {
                questItem = item;
            }
        }

        let itemPath = items[`${questItem}`];
        console.log(itemPath);
        let completion;
        const completionBefore = completion;

        for (let item of Object.values(itemPath.attributes)) {
            if (item.startsWith("completion")) {
                completion = item;
            }
        }

        completion = completion + progress;
        const completionAfter = completion;
        
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.athena`]: profile } });

        reply.status(200).send({
            status: "success",
            completionBefore: completionBefore,
            completionAfter: completionAfter
        })
    })
}

module.exports = quest;