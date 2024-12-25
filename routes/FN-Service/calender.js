require("dotenv").config();
const functions = require("../../utils/functions");
const keychain = require("../../responses/fortniteConfig/catalog/keychain.json");

async function calender(fastify, options) {
    fastify.get('/fortnite/api/calendar/v1/timeline', (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        const now = new Date();
        const cacheExpire = new Date(now.getFullYear() + 7975, now.getMonth(), now.getDate()).toISOString();
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
                    "cacheExpire": cacheExpire
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
                    "cacheExpire": cacheExpire
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
                    "cacheExpire": cacheExpire
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
                    "cacheExpire": cacheExpire
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
                    "cacheExpire": cacheExpire
                },
                "client-events": {
                    "states": [
                        {
                            "validFrom": now.toISOString(),
                            "activeEvents": [
                                {
                                    "eventType": `EventFlag.Season${memory.season}`,
                                    "activeUntil": "9999-01-01T00:00:00.000Z",
                                    "activeSince": now.toISOString()
                                },
                                {
                                    "eventType": `EventFlag.${memory.lobby}`,
                                    "activeUntil": "9999-01-01T00:00:00.000Z",
                                    "activeSince": now.toISOString()
                                }
                            ],
                            "state": {
                                "activeStorefronts": [],
                                "eventNamedWeights": {},
                                "activeEvents": [
                                    {
                                        "eventType": `EventFlag.Season${memory.season}`,
                                        "activeUntil": "9999-01-01T00:00:00.000Z",
                                        "activeSince": now.toISOString()
                                    },
                                    {
                                        "eventType": `EventFlag.${memory.lobby}`,
                                        "activeUntil": "9999-01-01T00:00:00.000Z",
                                        "activeSince": now.toISOString()
                                    }
                                ],
                                "seasonNumber": memory.season,
                                "seasonTemplateId": `AthenaSeason:athenaseason${memory.season}`,
                                "matchXpBonusPoints": 0,
                                "eventPunchCardTemplateId": "",
                                "seasonBegin": now.toISOString(),
                                "seasonEnd": process.env.SEASON_END,
                                "seasonDisplayedEnd": process.env.SEASON_END,
                                "weeklyStoreEnd": "9998-05-19T00:05:32.216Z",
                                "stwEventStoreEnd": "9998-05-19T00:05:32.216Z",
                                "stwWeeklyStoreEnd": "9998-05-19T00:05:32.216Z",
                                "sectionStoreEnds": {
                                    "Daily": "9998-05-19T00:05:32.216Z",
                                    "Featured": "9998-05-19T00:05:32.216Z"
                                },
                                "rmtPromotion": "",
                                "dailyStoreEnd": "9998-05-19T00:05:32.216Z"
                            }
                        }
                    ],
                    "cacheExpire": cacheExpire
                }
            },
            "cacheIntervalMins": 15,
            "currentTime": now.toISOString()
        })
    })
}

module.exports = calender;