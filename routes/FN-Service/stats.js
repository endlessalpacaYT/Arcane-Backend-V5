const User = require("../../database/models/user.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");

async function stats(fastify, options) {
    fastify.get('/fortnite/api/stats/accountId/:accountId/bulk/window/:windowId', async (request, reply) => {
        const { accountId } = request.params;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!Array.isArray(user.stats)) {
            user.stats = [];
            await user.save();
        }
        reply.status(200).send(user.stats);
        
        /*reply.status(200).send([
            {
                name: "br_placetop6_pc_m0_p9",
                value: 1,
            },
            {
                name: "br_placetop3_pc_m0_p9",
                value: 2,
            },
            {
                name: "br_matchesplayed_pc_m0_p9",
                value: 3,
            },
            {
                name: "br_placetop1_pc_m0_p9",
                value: 4,
            },
            {
                name: "br_kills_pc_m0_p9",
                value: 5,
            },
            {
                name: "br_minutesplayed_pc_m0_p9",
                value: 6,
            },
            {
                name: "br_placetop12_pc_m0_p10",
                value: 7,
            },
            {
                name: "br_placetop5_pc_m0_p10",
                value: 8,
            },
            {
                name: "br_matchesplayed_pc_m0_p10",
                value: 9,
            },
            {
                name: "br_placetop1_pc_m0_p10",
                value: 10,
            },
            {
                name: "br_kills_pc_m0_p10",
                value: 11,
            },
            {
                name: "br_minutesplayed_pc_m0_p10",
                value: 12,
            },
            {
                name: "br_placetop25_pc_m0_p2",
                value: 13,
            },
            {
                name: "br_placetop10_pc_m0_p2",
                value: 14,
            },
            {
                name: "br_placetop1_pc_m0_p2",
                value: 15,
            },
            {
                name: "br_kills_pc_m0_p2",
                value: 16,
            },
            {
                name: "br_matchesplayed_pc_m0_p2",
                value: 17,
            },
            {
                name: "br_minutesplayed_pc_m0_p2",
                value: 18,
            },
        ])*/
    })

    fastify.get('/fortnite/api/game/v2/leaderboards/cohort/:accountId', (request, reply) => {
        reply.status(200).send([]);
    })
}

module.exports = stats;