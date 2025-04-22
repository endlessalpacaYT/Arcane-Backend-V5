require("dotenv").config();
const functions = require("../../utils/functions");
const keychain = require("../../responses/fortniteConfig/catalog/keychain.json");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");

async function calender(fastify, options) {
    fastify.get('/fortnite/api/calendar/v1/timeline', (request, reply) => {
        const memory = functions.GetVersionInfo(request);
        /*if (memory.season != Number(process.env.SEASON)) {
            return createError.createError(errors.BAD_REQUEST.Bad_version, 400, reply);
        }*/

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
        } else if (memory.season == 10) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.Mayday",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10.Phase2",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10.Phase3",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_BlackMonday",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.S10_Oak",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.S10_Mystery",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_1",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_2",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_3",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_4",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_5",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_6",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_7",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_8",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_9",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.Season10_UrgentMission_10",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                /*{
                    "eventType": "RKT_Final", // idk what this does
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "survey_stw_ray_switch", // disables other gamemodes
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "survey_br_nick_001", // initialises nightnight
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                }*/)
        } else if (memory.season == 11) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.LTE_CoinCollectXP",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_Fortnitemares2019",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_Galileo_Feats",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_Galileo",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_WinterFest2019",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                })

            if (memory.build >= 11.2) {
                activeEvents.push(
                    {
                        "eventType": "EventFlag.Starlight",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    })
            }
        } else if (memory.season == 12) {
            activeEvents.push(
                {
                    "eventType": "EventFlag.LTE_SpyGames",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                },
                {
                    "eventType": "EventFlag.LTE_Oro",
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                })
            if (memory.build == 12.41) {
                activeEvents.push(
                    {
                        "eventType": "EventFlag.LTE_StormTheAgency",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    },
                    {
                        "eventType": "EventFlag.LTE_JerkyChallenges",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    },
                    {
                        "eventType": "EventFlag.LTE_SpyGames",
                        "activeUntil": "9999-01-01T00:00:00.000Z",
                        "activeSince": "2020-01-01T00:00:00.000Z"
                    },
                    {
                        eventType: "JCD01", // Travis Related (Countdown)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JH01", // Travis Related (Head)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JS01", // Travis Related (Stage Delivery Trucks)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JS02", // Travis Related (Stage Partially Built)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "9999-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JS03", // Travis Related (Stage Finished Stage)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JCH01", // Travis Related (Countdown)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JP01", // Travis Teaser posters Appear (Stage)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JL1", // Travis LeadUp 2 (Stage)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JL2", // Travis LeadUp 2 (Stage)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    },
                    {
                        eventType: "JLL", // Travis Load level (Level)
                        activeUntil: "9999-12-01T21:10:00.000Z",
                        activeSince: "2020-11-21T07:00:00.000Z"
                    })
            } else if (memory.build = 12.61) {
                activeEvents.push({
                    eventType: "FLCD01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FSCN01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FLL01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FHS02",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FCD01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FLA02",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FLA01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FCH01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "FHS01",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "EventFlag.LTE_Season12_End",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "EventFlag.LTE_BvgQuestPart4",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                },
                {
                    eventType: "EventFlag.LTE_StormTheAgency",
                    activeUntil: "9999-12-01T21:10:00.000Z",
                    activeSince: "2020-11-21T07:00:00.000Z"
                })
            }
        } else if (memory.season == 13) {
            // Change water level with eventflag "WL${WaterLevel}" There are 7 possible water levels 0 being bottom
            activeEvents.push({
                "eventType": "WL7",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        } else if (memory.season == 18) {
            activeEvents.push({
                "eventType": "EventFlag.LTE_Season18_BirthdayQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_07",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_08",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_09",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_10",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_11",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_12",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTQ_S18_Repeatable_Weekly_06",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Event_Fornitemares_2021",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Event_HordeRush",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.Event_SoundWave",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.LTE_Season18_TextileQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.S18_WildWeek_Shadows",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.S18_WildWeek_Bargain",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            },
            {
                "eventType": "EventFlag.S18_Haste",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            })
        } else if (memory.season == 28) {
            if (memory.build == 28.10) {
                activeEvents.push({
                    eventType: "EventFlag.Event_LinedNotebook_Teaser", // TMNT Tab countdown
                    activeUntil: "9999-09-14T07:00:00.000Z",
                    activeSince: "2020-09-09T07:00:00.000Z"
                })
            } else if (memory.build == 28.20 || memory.build == 28.30) {
                activeEvents.push({
                    eventType: "EventFlag.Event_LinedNotebook", // TMNT mini pass
                    activeUntil: "9999-09-14T07:00:00.000Z",
                    activeSince: "2020-09-09T07:00:00.000Z"
                })
            }

            if (memory.build == 28.30) {
                activeEvents.push({
                    eventType: "CH5S1CPPE", //Pre-Emergence Event (Central Picnic)
                    activeUntil: "2024-03-03T02:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                },
                {
                    eventType: "CH5S1CPCE", //Crater event - Pre-Emergence Event (Central Picnic)
                    activeUntil: "2024-03-01T02:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                },
                {
                    eventType: "CH5S1CPTE", //Thump Event - Pre-Emergence Event (Central Picnic)
                    activeUntil: "2024-03-01T01:40.000Z",
                    activeSince: "2024-03-01T00:40:00.000Z"
                },
                {
                    eventType: "CH5S1CPFH", //Final Hour - Pre-Emergence Event (Central Picnic)
                    activeUntil: "2024-03-03T10:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                },
                {
                    eventType: "CH5S1CPFP", //Titan Hand Appears (Central Picnic)
                    activeUntil: "2024-03-03T02:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                },
                {
                    eventType: "CH5S1CPPP", //Primary Events (Central Picnic)
                    activeUntil: "2024-03-03T02:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                },
                {
                    eventType: "CH5S1CPEP", //Post-Chain Event (Central Picnic)
                    activeUntil: "2024-03-03T02:00.000Z",
                    activeSince: "2024-03-01T00:50:00.000Z"
                })
            }
        } else if (memory.season == 33) {
            activeEvents.push({
                "eventType": "EventFlag.Event_DelMar_Season01_Dailies",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-04-09T13:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Juno_Osiris_TownRewards",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-05-03T13:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Juno_Hardcore",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-06-11T08:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_DelMar_QuestPack_02",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-07-26T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Ecosystem_DailyBonusGoals",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-11-28T09:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_ JunoQuestRepeatable  ",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-11-30T05:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Evergreen_DailyQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-01T07:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_BR_Ch06_MapDiscovery",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-01T09:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_S33_UISeasonEnd",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-01T09:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_DelMar_Season04",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-01T12:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_DelMar_Season04_Rank",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-01T12:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_FigmentQuests_Ch01_MapDiscovery",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-06T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_FigmentQuests_Evergreen",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-06T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_ReloadQuests_Ch06_MapDiscovery",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-06T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_JunoSeason1Pass",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-10T05:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_S33_FeralCorgiQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-11T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_SproutQuestDaily",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-12T07:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_S33_MobileSproutQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-12-12T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_SparksS07",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-13T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.D5Science",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2020-01-01T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Starlight.Quests.Phase5",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Blockbuster2018",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Blockbuster2018Phase1",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Blockbuster2018Phase2",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Blockbuster2018Phase3",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Blockbuster2018Phase4",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.LobbyStW.Blockbuster",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Phoenix.NewBeginnings",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Phoenix.NewBeginnings.Quests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.PassiveIceStorms",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.PassiveFireStorms",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.PassiveLightningStorms",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.ActiveMiniBosses",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.MissionAlert.MegaAlert",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.MissionAlert.MegaAlertMiniboss",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.ElderGroupMissions",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.BetaStorms.B",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.STWHuntMonster",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-23T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_SparksS07_WeeklyQuests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-24T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_FigmentQuests_S02",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-30T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_FigmentPassS02",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-31T10:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_S33_Scenario_BatterBoi",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-01-31T14:00:00.000Z"
            }, {
                "eventType": "EventFlag.Season12.NoDancing.Quests",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-06T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.LoveStorm.EnableEnemyVariants",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-06T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_ReloadQuests_Boost_R01",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-11T14:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.lastresort",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-14T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.losecontrol",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-14T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.blingbangbangborn",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-14T00:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_S33_ChatQuest",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-15T20:31:00.000Z"
            }, {
                "eventType": "PilgrimSong.mambonofive",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.circles",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.allthegoodgirls",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.stickseason",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.dontletmedown",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.wolves",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.heybrother",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.hailtotheking",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.themiddle",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "Sparks.Spotlight.lastresort",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.positions",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.dancingintheflames",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.demons",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.maps",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "Sparks.Spotlight.losecontrol",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.closer",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.beautyandabeat",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.miku",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.nightmare",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.wildones",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.feather",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.californication",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.rightround",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "Sparks.Spotlight.blingbangbangborn",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.beautifulthings",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.myhouse",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.centuries",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.battery",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.comeandgo",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            }, {
                "eventType": "PilgrimSong.birdsofafeather",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2025-02-16T00:00:00.000Z"
            })
        } else if (memory.season == 34) {
            activeEvents.push({
                "eventType": "EventFlag.Event_DelMar_Season01_Dailies",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-04-09T13:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Juno_Osiris_TownRewards",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-05-03T13:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_Juno_Hardcore",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-06-11T08:00:00.000Z"
            }, {
                "eventType": "EventFlag.Event_DelMar_QuestPack_02",
                "activeUntil": "9999-01-01T00:00:00.000Z",
                "activeSince": "2024-07-26T00:00:00.000Z"
            })
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
                                "activeEvents": [],
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
