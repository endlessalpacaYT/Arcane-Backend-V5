require("dotenv").config();

const Profile = require("../../database/models/profile.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const questLimits = require("../../responses/fortniteConfig/Athena/questLimits.json");

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
                // Todo: Push detailed information about each quest
                quests.push(templateId)
            } else if (templateId.includes("QS")) {
                //quests.push(templateId);
            } else if (templateId.includes("Challenge")) {
                //quests.push(templateId);
            } else { }
        }

        reply.status(200).send(quests);
    })


    // TODO: Make this work!
    fastify.post('/fortnite/api/v1/profile/:accountId/quests/addCompletion', async (request, reply) => {
        const { accountId } = request.params;
        const { templateId, progress, apiKey } = request.body;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!apiKey || apiKey != process.env.JWT_SECRET) {
            return reply.status(403).send()
        }

        const profile = profiles.profiles["athena"];
        const items = profile.items;

        let questKey = null;
        for (const [key, item] of Object.entries(items)) {
            if (item.templateId.includes(templateId)) {
                questKey = key;
                break;
            }
        }
        let season = process.env.season;

        // find the index for the quest limits
        let index;
        if (templateId.includes("QS")) {
            index = Object.keys(questLimits).find(key => questLimits[season][key]?.templateId === templateId);
            if (index == -1) {
                return reply.status(404).send();
            }
        } else {
            index = Object.keys(questLimits).find(key => questLimits.Daily[key]?.templateId === templateId);
        }

        const itemPath = items[questKey];

        let completionKey = null;
        for (const [key, value] of Object.entries(itemPath.attributes)) {
            if (key.startsWith("completion")) {
                completionKey = key;
                break;
            }
        }

        const completionBefore = itemPath.attributes[completionKey];
        const questLimit = questLimits[index];
        itemPath.attributes[completionKey] += progress;
        if (itemPath.attributes[completionKey] > questLimit.maxProgress) {
            itemPath.attributes[completionKey] = questLimit.maxProgress;
            itemPath.attributes.quest_state = "Completed";
        } else if (!questLimit) {
            itemPath.attributes[completionKey] = 0;
        }

        const completionAfter = itemPath.attributes[completionKey];

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.athena`]: profile } });

        reply.status(200).send({
            status: "success",
            completionBefore: completionBefore,
            completionAfter: completionAfter,
        });
    });
}

module.exports = quest;