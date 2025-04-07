const functions = require("../../utils/functions");

async function misc(fastify, options) {
    fastify.post('/api/v1/fortnite-br/channel/:channelId/target', (request, reply) => {
        reply.status(200).send({
            "parameters": {
                "platform": "Windows",
                "language": "en",
                "serverRegion": "EU",
                "country": "EN-GB",
                "hasSavedEventDate": false,
                "hasAttendedEndOfSeasonS17": false,
                "subscription": false,
                "ownsSaveTheWorld": true,
                "filterRestricted": false,
                "filterConsent": false,
                "filterLimited": false,
                "allowedContentTypes": ["functional", "experience", "marketing"],
                "ratingAuthority": "USK",
                "rating": "USK_AGE_16",
                "socialTags": ["BR - Duos"],
                "battlepass": false,
                "battlepassLevel": 1,
                "accountLevel": 1066,
                "victoryCrownsRoyales": 0,
                "globalCash": 0,
                "battlepassStars": 0,
                "battlepassItemsClaimed": 0,
                "unlockedPages": 14,
                "unlockedBonusPages": 0,
                "progressiveBackblingStage": 0,
                "S21ProgressivePhotonicStrikerPickaxe": 0,
                "completedQuests": ["RaiderPinkSherbetQuestGranted"]
            },
            "tags": ["Product.BR"]
        })
    })

    fastify.post('/api/v1/fortnite-br/interactions', (request, reply) => {
        reply.status(200).send();
    })

    fastify.post('/api/v1/fortnite-br/interactions/contentHash', (request, reply) => {
        reply.status(200).send();
    })

    fastify.post('/api/v1/fortnite-br/surfaces/:surfaceId/target', (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        let motdTarget;
        if (memory.season == 26) {
            motdTarget = require("../../responses/fortniteConfig/seasonalMotds/26.json");
        } else {
            motdTarget = require("../../responses/fortniteConfig/motdTarget.json");
        }

        reply.status(200).send(motdTarget);
    })
}

module.exports = misc;