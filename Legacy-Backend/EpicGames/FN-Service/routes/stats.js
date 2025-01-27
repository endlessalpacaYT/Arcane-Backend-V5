async function stats(fastify, options) {
    fastify.get('/fortnite/api/stats/accountId/:accountId/bulk/window/:windowId', (request, reply) => {
        reply.status(200).send([
            {
                "name": "br_score_pc_m0_p10",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            },
            {
                "name": "br_score_pc_m0_p2",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            },
            {
                "name": "br_kills_pc_m0_p2",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            },
            {
                "name": "br_matchesplayed_pc_m0_p2",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            },
            {
                "name": "br_kills_pc_m0_p9",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            },
            {
                "name": "br_minutesplayed_pc_m0_p2",
                "value": 0,
                "window": "alltime",
                "ownerType": 1
            }
        ])
    })

    fastify.get('/fortnite/api/game/v2/leaderboards/cohort/:accountId', (request, reply) => {
        reply.status(200).send({
            "accountId": request.params.accountId,
            "cohortAccounts": [
                request.params.accountId,
                global.botId || "ArcaneV5"
            ],
            "expiresAt": "9999-12-31T00:00:00.000Z",
            "playlist": request.query.playlist
        });
    })

    fastify.get('/fortnite/api/leaderboards/type/group/stat/*', (request, reply) => {
        reply.status(200).send([]);
    })
}

module.exports = stats;