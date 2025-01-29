require("dotenv").config();

const Profile = require("../../database/models/profile.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const xpMap = require(`../../responses/fortniteConfig/Athena/XPMaps/${process.env.SEASON}.json`);

async function xp(fastify, options) {
    fastify.post('/fortnite/api/v1/profile/:accountId/xp/add', async (request, reply) => {
        const { accountId } = request.params;
        const { reason, apiKey } = request.body;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!apiKey || apiKey != process.env.JWT_SECRET) {
            return reply.status(403).send()
        }
        
        const profile = profiles.profiles["athena"];

        let statChanged = false;

        let level = profile.stats.attributes.level - 1;
        let xp = profile.stats.attributes.xp;
        let book_xp = profile.stats.attributes.book_xp;
        let book_level = profile.stats.attributes.book_level;
        let leveldata = xpMap.levels[level];
        let levelXP = xpMap.levels[level].xpRequired;
        let levelBook = xpMap.levels[level].book_xp;

        const beforeChanges = {
            level: level + 1,
            xp: xp,
            book_xp: book_xp,
            book_level: book_level,
            accountLevel: profile.stats.attributes.accountLevel
        }

        try {
            if (reason == "kill") {
                xp = xp + Number(process.env.XP_KILL);
                profile.stats.attributes.xp += Number(process.env.XP_KILL);
            } else if (reason == "win") {
                xp = xp + Number(process.env.XP_WIN);
                profile.stats.attributes.xp += Number(process.env.XP_WIN);
            } else {
                console.warn(`Unexpected XP Reason: ${reason}`);
                xp = xp + 10;
                profile.stats.attributes.xp += 10;
            }
        } catch (err) {
            console.error(`Error In XP: ${err}`);
            xp = xp + 10;
        }
        
        while (!statChanged) {
            if (xp > levelXP) {
                level++;
                profile.stats.attributes.level += 1;
                profile.stats.attributes.accountLevel++;
                book_xp = book_xp + levelBook;
                profile.stats.attributes.book_xp += levelBook;
                if (book_xp > 10) {
                    book_xp = book_xp - 10;
                    profile.stats.attributes.book_xp -= 10;
                    book_level++;
                    profile.stats.attributes.book_level += 1;
                }
                xp = xp - levelXP;
                profile.stats.attributes.xp -= levelXP;
            } else {
                statChanged = true;
            }
        }

        level++;
        if (statChanged) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.athena`]: profile } });
        }

        const afterChanges = {
            level: level,
            xp: xp,
            book_xp: book_xp,
            book_level: book_level,
            accountLevel: profile.stats.attributes.accountLevel
        }

        reply.status(200).send({
            status: "success",
            beforeChanges: beforeChanges,
            afterChanges: afterChanges
        })
    })

    fastify.get('/fortnite/api/v1/profile/:accountId/xp/get', async (request, reply) => {
        const { accountId } = request.params;

        const profiles = await Profile.findOne({ accountId: accountId });
        if (!profiles) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        const profile = profiles.profiles["athena"];

        reply.status(200).send({
            level: profile.stats.attributes.level
        })
    })
}

module.exports = xp;