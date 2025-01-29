async function epicFriends(fastify, options) {
    fastify.get('/epic/friends/v1/:accountId/blocklist', (request, reply) => {
		reply.status(200).send([]);
	});
}

module.exports = epicFriends;