require("dotenv").config();
const functions = require("../../utils/functions");
const keychain = require("../../responses/fortniteConfig/catalog/keychain.json");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");

async function calender(fastify, options) {
    fastify.get('/fortnite/api/calendar/v1/timeline', (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        if (memory.season != Number(process.env.SEASON)) {
            return createError.createError(errors.BAD_REQUEST.Bad_version, 400, reply);
        }

        const dailyEnd = global.dailyEnd;
        const weeklyEnd = global.weeklyEnd;
        const now = new Date();

        let activeEvents = [
            {
                "eventType": `EventFlag.Season${memory.season}`,
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-26T00:00:00.000Z"
            },
            {
                "eventType": `EventFlag.${memory.lobby}`,
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-26T00:00:00.000Z"
            }
        ];

        if (memory.season === 4) {
            if (memory.build >= 4.5) {
                activeEvents.push(
                    {
                        "eventType": "EventFlag.Blockbuster2018Phase4",
                        "activeUntil": "2025-01-20T01:00:00.000Z",
                        "activeSince": "2024-12-26T00:00:00.000Z"
                    },
                    {
                        "eventType": "EventFlag.BR_S4_Geode_Countdown",
                        "activeUntil": "2025-01-20T01:00:00.000Z",
                        "activeSince": "2024-12-26T11:00:00.000Z"
                    }
                );
            }
        } else if (memory.season === 5) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.RoadTrip2018",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Horde",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Anniversary2018_BR",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTM_Heist",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                })
            if (memory.build == 5.10) {
                activeEvents.push(
                    {
                        "eventType": "EventFlag.BirthdayBattleBus",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    })
            }
        }

        reply.status(200).send({
            "channels": {
                "standalone-store": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "activePurchaseLimitingEventIds": [],
                                "storefront": {},
                                "rmtPromotionConfig": [],
                                "storeEnd": "0001-01-01T00:00:00.000Z"
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "client-matchmaking": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "region": {
                                    "OCE": {
                                        "eventFlagsForcedOff": ["Playlist_DefaultDuo"]
                                    },
                                    "CN": {
                                        "eventFlagsForcedOff": [
                                            "Playlist_DefaultDuo",
                                            "Playlist_Bots_DefaultDuo",
                                            "Playlist_Deimos_DuoCN"
                                        ]
                                    },
                                    "REGIONID": {
                                        "eventFlagsForcedOff": ["Playlist_Deimos_Duo_WinterCN"]
                                    },
                                    "ASIA": {
                                        "eventFlagsForcedOff": ["Playlist_DefaultDuo"]
                                    }
                                }
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "tk": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "k": keychain
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "featured-islands": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "islandCodes": [],
                                "playlistCuratedContent": {},
                                "playlistCuratedHub": {
                                    "Playlist_PlaygroundV2": "4707-3216-0421",
                                    "Playlist_Creative_PlayOnly": "4707-3216-0421"
                                },
                                "islandTemplates": []
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "community-votes": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [],
                            "state": {
                                "electionId": "",
                                "candidates": [],
                                "electionEnds": "9999-12-31T23:59:59.999Z",
                                "numWinners": 1
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                },
                "client-events": {
                    "states": [
                        {
                            "validFrom": "2024-12-26T11:00:00.000Z",
                            "activeEvents": activeEvents,
                            "state": {
                                "activeStorefronts": [],
                                "eventNamedWeights": {},
                                "activeEvents": activeEvents,
                                "seasonNumber": memory.season,
                                "seasonTemplateId": `AthenaSeason:athenaseason${memory.season}`,
                                "matchXpBonusPoints": 0,
                                "eventPunchCardTemplateId": "",
                                "seasonBegin": "2024-12-26T11:00:00.000Z",
                                "seasonEnd": process.env.SEASON_END,
                                "seasonDisplayedEnd": process.env.SEASON_END,
                                "weeklyStoreEnd": weeklyEnd,
                                "stwEventStoreEnd": "9998-05-19T00:05:32.216Z",
                                "stwWeeklyStoreEnd": weeklyEnd,
                                "sectionStoreEnds": {
                                    "Daily": dailyEnd,
                                    "Featured": weeklyEnd
                                },
                                "rmtPromotion": "",
                                "dailyStoreEnd": dailyEnd
                            }
                        }
                    ],
                    "cacheExpire": "9999-01-01T00:00:00.000Z"
                }
            },
            "cacheIntervalMins": 15,
            "currentTime": now.toISOString()
        })
    })
}

module.exports = calender;