const eventListActive = require("../../responses/fortniteConfig/event/eventListActive.json");
const Events = require("../../database/models/events");

async function events(fastify, options) {
    fastify.get('/api/v1/events/Fortnite/download/:accountId', async (request, reply) => {
        const events = await Events.find().lean();
        eventListActive.events.push(events);

        return reply.status(200).send(eventListActive);
    })

    fastify.get('/api/v1/events/Fortnite/:eventId/history/:accountId', async (request, reply) => {
        const { eventId, accountId } = request.params;

        return reply.status(200).send([
            {
                "scoreKey": {
                    "gameId": "Fortnite",
                    "eventId": eventId,
                    "eventWindowId": eventId,
                    "_scoreId": null
                },
                "teamId": accountId,
                "teamAccountIds": [accountId],
                "liveSessionId": null,
                "pointsEarned": 0,
                "score": 0,
                "rank": 1,
                "percentile": 0,
                "pointBreakdown": {
                    "PLACEMENT_STAT_INDEX:14": {
                        "timesAchieved": 0,
                        "pointsEarned": 0
                    }
                },
                "sessionHistory": [],
                "unscoredSessions": []
            }
        ])
    })

    fastify.post('/api/v1/events/Fortnite/push', async (request, reply) => {
        const {
            secretKey,
            eventId,
            displayDataId,
            announcementTime,
            metadata,
            eventWindows,
            beginTime,
            endTime
        } = request.body;
        if (!secretKey || secretKey != global.secretKey) {
            return reply.status(403).send({ error: "suck my balls" })
        }

        const now = new Date();
        now.setDate(now.getDate() + 7);
        const week = now.toISOString();

        const newEvent = new Events({
            eventId: eventId ? eventId : (displayDataId ? displayDataId : "s16_consolechamps"),
            displayDataId: displayDataId ? displayDataId : (eventId ? eventId : "s16_consolechamps"),
            announcementTime: announcementTime ? announcementTime : new Date().toISOString(),
            metadata: metadata ? metadata : { "minimumAccountLevel": 0 },
            eventWindows: eventWindows ? eventWindows : {},
            beginTime: beginTime ? beginTime : new Date().toISOString(),
            endTime: endTime ? endTime : week
        })
        await newEvent.save();
        const event = await Events.findOne({ eventId: newEvent.eventId, beginTime: newEvent.beginTime });

        return reply.status(200).send(event)
    })

    fastify.delete('/api/v1/events/Fortnite/delete', async (request, reply) => {
        const { secretKey, id } = request.body;
        if (!secretKey || secretKey != global.secretKey) {
            return reply.status(403).send({ error: "suck my balls" })
        }

        const event = await Events.findOneAndDelete({ id: id });
        if (!event) {
            reply.status(404).send()
        }

        return reply.status(200).send({}, 204)
    })

    fastify.get('/salesEvent/salesEvent/*', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get('/gameRating/gameRating/*', (request, reply) => {
        reply.status(200).send();
    })
}

module.exports = events;