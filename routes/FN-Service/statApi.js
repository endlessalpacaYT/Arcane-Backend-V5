const User = require("../../database/models/user.js");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

async function statApi(fastify, options) {
    fastify.post('/fortnite/api/v1/profile/:accountId/stats/increment', { preHandler: tokenVerify }, async (request, reply) => {
        const { accountId } = request.params;
        const { name } = request.body;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }
        if (!Array.isArray(user.stats)) {
            user.stats = [];
        }
        const stats = user.stats;
        const statIndex = user.stats.findIndex(stat => stat.name === name);

        if (statIndex !== -1) {
            user.stats[statIndex].value += 1;
        } else {
            user.stats.push({ name: name, value: 1 });
        }
        user.markModified('stats');
        user.set('stats', stats);
        await user.save();

        return reply.status(200).send({ stats: user.stats });
    })
}

module.exports = statApi;