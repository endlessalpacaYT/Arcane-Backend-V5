require("dotenv").config();
const functions = require("../../utils/functions");
const keychain = require("../../responses/fortniteConfig/catalog/keychain.json");

const dailyEnd = new Date(Date.now() + 86400 * 1000).toISOString();
const weeklyEnd = new Date(Date.now() + 604800 * 1000).toISOString();

async function calender(fastify, options) {
    fastify.get('/fortnite/api/calendar/v1/timeline', (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        const now = new Date();
        const cacheExpire = new Date(now.getFullYear() + 7975, now.getMonth(), now.getDate()).toISOString();

        let activeEvents = [
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
        ];

        if (memory.season === 4) {
            if (memory.build > - 4.5) {
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
                            "activeEvents": activeEvents,
                            "state": {
                                "activeStorefronts": [],
                                "eventNamedWeights": {},
                                "activeEvents": activeEvents,
                                "seasonNumber": memory.season,
                                "seasonTemplateId": `AthenaSeason:athenaseason${memory.season}`,
                                "matchXpBonusPoints": 0,
                                "eventPunchCardTemplateId": "",
                                "seasonBegin": now.toISOString(),
                                "seasonEnd": process.env.SEASON_END,
                                "seasonDisplayedEnd": process.env.SEASON_END,
                                "weeklyStoreEnd": weeklyEnd,
                                "stwEventStoreEnd": "9998-05-19T00:05:32.216Z",
                                "stwWeeklyStoreEnd": "9998-05-19T00:05:32.216Z",
                                "sectionStoreEnds": {
                                    "Daily": dailyEnd,
                                    "Featured": weeklyEnd
                                },
                                "rmtPromotion": "",
                                "dailyStoreEnd": dailyEnd
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