async function stats(fastify, options) {
    fastify.get('/statsproxy/api/statsv2/account/:accountId', (request, reply) => {
        reply.status(200).send({
            "startTime": 0,
            "endTime": 9223372036854775807,
            "stats": {
                "br_playersoutlived_keyboardmouse_m0_playlist_melt_duos": 32,
                "br_placetop12_keyboardmouse_m0_playlist_bots_defaultduo": 25,
                "br_placetop5_keyboardmouse_m0_playlist_deimos_duo_winter": 2,
                "br_score_keyboardmouse_m0_playlist_habanerosolo": 472
            },
            "accountId": request.params.accountId
        })
    })

    fastify.get('/fortnite/api/statsv2/account/:accountId', (request, reply) => {
        reply.status(200).send({
            "startTime": 0,
            "endTime": 9223372036854775807,
            "stats": {
                "br_playersoutlived_keyboardmouse_m0_playlist_melt_duos": 32,
                "br_placetop12_keyboardmouse_m0_playlist_bots_defaultduo": 25,
                "br_placetop5_keyboardmouse_m0_playlist_deimos_duo_winter": 2,
                "br_score_keyboardmouse_m0_playlist_habanerosolo": 472
            },
            "accountId": request.params.accountId
        })
    })

    fastify.post('/statsproxy/api/statsv2/query', (request, reply) => {
        reply.status(200).send([
            {
                "startTime": 0,
                "endTime": 9223372036854775807,
                "stats": {
                    "br_playersoutlived_keyboardmouse_m0_playlist_melt_duos": 32,
                    "br_placetop12_keyboardmouse_m0_playlist_bots_defaultduo": 25,
                    "br_placetop5_keyboardmouse_m0_playlist_deimos_duo_winter": 2,
                    "br_score_keyboardmouse_m0_playlist_habanerosolo": 472
                },
                "accountId": "ArcaneV5"
            }
        ])
    })

    fastify.post('/fortnite/api/statsv2/query', (request, reply) => {
        reply.status(200).send([
            {
                "startTime": 0,
                "endTime": 9223372036854775807,
                "stats": {
                    "br_playersoutlived_keyboardmouse_m0_playlist_melt_duos": 32,
                    "br_placetop12_keyboardmouse_m0_playlist_bots_defaultduo": 25,
                    "br_placetop5_keyboardmouse_m0_playlist_deimos_duo_winter": 2,
                    "br_score_keyboardmouse_m0_playlist_habanerosolo": 472
                },
                "accountId": "ArcaneV5"
            }
        ])
    })
}

module.exports = stats;