async function mnemonic(fastify, options) {
    fastify.get('/links/api/:namespace/mnemonic/:mnemonic', (request, reply) => {
        reply.status(200).send({
            "namespace": "fn",
            "accountId": "epic",
            "creatorName": "Epic",
            "mnemonic": "playlist_trios",
            "linkType": "BR:Playlist",
            "metadata": {
                "parent_set": "set_br_playlists",
                "favorite_override": "set_br_playlists",
                "play_history_override": "set_br_playlists",
                "image_url": "https://cdn2.unrealengine.com/s24-trios-1920-1920x1080-3e751867870b.jpg",
                "image_urls": {
                    "url_s": "https://cdn2.unrealengine.com/s24-trios-480-480x270-42df252e6002.jpg",
                    "url_xs": "https://cdn2.unrealengine.com/s24-trios-256-256x144-0585c93c17fe.jpg",
                    "url_m": "https://cdn2.unrealengine.com/s24-trios-640-640x360-242337935fac.jpg",
                    "url": "https://cdn2.unrealengine.com/s24-trios-1920-1920x1080-3e751867870b.jpg"
                },
                "matchmaking": {
                    "override_playlist": "playlist_trios"
                },
                "video_vuid": "taqdZkWyokbCyEFWld"
            },
            "version": 95,
            "active": true,
            "disabled": false,
            "created": "2021-10-01T00:56:45.053Z",
            "published": "2021-08-03T15:27:20.799Z",
            "descriptionTags": [],
            "moderationStatus": "Unmoderated"
        })
    })

    fastify.post('/links/api/:namespace/mnemonic', (request, reply) => {
        reply.status(200).send([
            {
                "namespace": "fn",
                "accountId": "bcbeb118-9f98-41fb-b049-7a5cde8b19cd",
                "creatorName": "Pongo_x86",
                "mnemonic": "1832-0431-4852",
                "linkType": "valkyrie:application",
                "metadata": {
                    "quicksilver_id": "cd0bb5ad-561e-459a-8a41-8f99b28490a8",
                    "gameFeaturesets": [],
                    "image_url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg",
                    "public_modules": {},
                    "image_urls": {
                        "url_s": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_s.jpeg",
                        "url_m": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_m.jpeg",
                        "url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg"
                    },
                    "locale": "de",
                    "title": "Skibidi Boxfights!",
                    "matchmakingV2": {
                        "allowJoinInProgress": true,
                        "allowSquadFillOption": false,
                        "maxPlayers": 2,
                        "islandQueuePrivacy": "Unrestricted",
                        "maxSocialPartySize": 2,
                        "maxTeamCount": 2,
                        "maxTeamSize": 2
                    },
                    "mode": "live",
                    "ratings": {
                        "boards": {
                            "ACB": {
                                "descriptors": [
                                    "ACB_MildViolence",
                                    "ACB_ScaryScenes",
                                    "ACB_GEMCO"
                                ],
                                "rating_overridden": false,
                                "rating": "ACB_AGE_PG",
                                "initial_rating": "ACB_AGE_PG",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "PEGI": {
                                "descriptors": [
                                    "PEGI_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "PEGI_AGE_12",
                                "initial_rating": "PEGI_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Generic": {
                                "descriptors": [
                                    "GEN_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "GEN_AGE_12",
                                "initial_rating": "GEN_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ClassInd": {
                                "descriptors": [
                                    "ClassInd_Violencia"
                                ],
                                "rating_overridden": false,
                                "rating": "CLASSIND_AGE_12",
                                "initial_rating": "CLASSIND_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "USK": {
                                "descriptors": [
                                    "USK_FantasyGewalt_v9_0"
                                ],
                                "rating_overridden": false,
                                "rating": "USK_AGE_12",
                                "initial_rating": "USK_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "GRAC": {
                                "descriptors": [
                                    "GRAC_Violence_v7_1",
                                    "GRAC_Fear_v7_1"
                                ],
                                "rating_overridden": false,
                                "rating": "GRAC_AGE_ALL",
                                "initial_rating": "GRAC_AGE_ALL",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ESRB": {
                                "descriptors": [
                                    "ESRB_Violence"
                                ],
                                "rating_overridden": false,
                                "rating": "ESRB_AGE_T",
                                "initial_rating": "ESRB_AGE_T",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Russia": {
                                "descriptors": [
                                    "RUS_Violence_v7_0"
                                ],
                                "rating_overridden": false,
                                "rating": "RUSSIA_AGE_16",
                                "initial_rating": "RUSSIA_AGE_16",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            }
                        }
                    },
                    "dynamicXp": {
                        "uniqueGameVersion": 220,
                        "calibrationPhase": "LiveXp"
                    },
                    "tagline": "✔ skibidi Boxfights\n✔ Always Updated\n✔ Made By ObsessedTech (AKA: Pongo_x86)\n\nFind skibidi toilets through matchmaking!",
                    "square_image_urls": {
                        "url_s": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_s.jpeg",
                        "url_m": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_m.jpeg",
                        "url": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square.jpeg"
                    },
                    "supportCode": "raider464",
                    "projectId": "01bc143d-330e-4292-b941-86fb24d042f0",
                    "introduction": "\n\n",
                    "attributions": []
                },
                "version": 220,
                "active": true,
                "disabled": false,
                "created": "2024-12-11T03:49:25.334Z",
                "published": "2020-11-03T18:58:25.865Z",
                "descriptionTags": [
                    "1v1",
                    "competitive",
                    "practice",
                    "building"
                ],
                "moderationStatus": "Approved",
                "lastActivatedDate": "2024-12-11T03:50:20.646Z",
                "discoveryIntent": "PUBLIC",
                "linkState": "LIVE"
            },
            {
                "namespace": "fn",
                "accountId": "bcbeb118-9f98-41fb-b049-7a5cde8b19cd",
                "creatorName": "Pongo_x86",
                "mnemonic": "1832-0469-4852",
                "linkType": "valkyrie:application",
                "metadata": {
                    "quicksilver_id": "cd0bb5ad-561e-459a-8a41-8f99b28490a8",
                    "gameFeaturesets": [],
                    "image_url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg",
                    "public_modules": {},
                    "image_urls": {
                        "url_s": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_s.jpeg",
                        "url_m": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_m.jpeg",
                        "url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg"
                    },
                    "locale": "en",
                    "title": "Sigma Boxfights!",
                    "matchmakingV2": {
                        "allowJoinInProgress": true,
                        "allowSquadFillOption": false,
                        "maxPlayers": 2,
                        "islandQueuePrivacy": "Unrestricted",
                        "maxSocialPartySize": 2,
                        "maxTeamCount": 2,
                        "maxTeamSize": 2
                    },
                    "mode": "live",
                    "ratings": {
                        "boards": {
                            "ACB": {
                                "descriptors": [
                                    "ACB_MildViolence",
                                    "ACB_ScaryScenes",
                                    "ACB_GEMCO"
                                ],
                                "rating_overridden": false,
                                "rating": "ACB_AGE_PG",
                                "initial_rating": "ACB_AGE_PG",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "PEGI": {
                                "descriptors": [
                                    "PEGI_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "PEGI_AGE_12",
                                "initial_rating": "PEGI_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Generic": {
                                "descriptors": [
                                    "GEN_ModerateViolence"
                                ],
                                "rating_overridden": false,
                                "rating": "GEN_AGE_12",
                                "initial_rating": "GEN_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ClassInd": {
                                "descriptors": [
                                    "ClassInd_Violencia"
                                ],
                                "rating_overridden": false,
                                "rating": "CLASSIND_AGE_12",
                                "initial_rating": "CLASSIND_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "USK": {
                                "descriptors": [
                                    "USK_FantasyGewalt_v9_0"
                                ],
                                "rating_overridden": false,
                                "rating": "USK_AGE_12",
                                "initial_rating": "USK_AGE_12",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "GRAC": {
                                "descriptors": [
                                    "GRAC_Violence_v7_1",
                                    "GRAC_Fear_v7_1"
                                ],
                                "rating_overridden": false,
                                "rating": "GRAC_AGE_ALL",
                                "initial_rating": "GRAC_AGE_ALL",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "ESRB": {
                                "descriptors": [
                                    "ESRB_Violence"
                                ],
                                "rating_overridden": false,
                                "rating": "ESRB_AGE_T",
                                "initial_rating": "ESRB_AGE_T",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            },
                            "Russia": {
                                "descriptors": [
                                    "RUS_Violence_v7_0"
                                ],
                                "rating_overridden": false,
                                "rating": "RUSSIA_AGE_16",
                                "initial_rating": "RUSSIA_AGE_16",
                                "interactive_elements": [
                                    "IE_UsersInteract"
                                ]
                            }
                        }
                    },
                    "dynamicXp": {
                        "uniqueGameVersion": 220,
                        "calibrationPhase": "LiveXp"
                    },
                    "tagline": "✔ Sigma Boxfights\n✔ Always Updated\n✔ Made By ObsessedTech (AKA: Pongo_x86)\n\nFind Sigmas through matchmaking!",
                    "square_image_urls": {
                        "url_s": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_s.jpeg",
                        "url_m": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_m.jpeg",
                        "url": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square.jpeg"
                    },
                    "supportCode": "raider464",
                    "projectId": "01bc143d-330e-4292-b941-86fb24d042f0",
                    "introduction": "\n\n",
                    "attributions": []
                },
                "version": 220,
                "active": true,
                "disabled": false,
                "created": "2024-12-11T03:49:25.334Z",
                "published": "2020-11-03T18:58:25.865Z",
                "descriptionTags": [
                    "1v1",
                    "competitive",
                    "practice",
                    "building"
                ],
                "moderationStatus": "Approved",
                "lastActivatedDate": "2024-12-11T03:50:20.646Z",
                "discoveryIntent": "PUBLIC",
                "linkState": "LIVE"
            }
        ])
    })

    fastify.get('/links/api/:namespace/mnemonic/:mnemonic/related', (request, reply) => {
        reply.status(200).send({
            "parentLinks": [],
            "links": {
                "1832-0431-4852": {
                    "namespace": "fn",
                    "accountId": "bcbeb118-9f98-41fb-b049-7a5cde8b19cd",
                    "creatorName": "Pongo_x86",
                    "mnemonic": "1832-0431-4852",
                    "linkType": "valkyrie:application",
                    "metadata": {
                        "quicksilver_id": "cd0bb5ad-561e-459a-8a41-8f99b28490a8",
                        "gameFeaturesets": [],
                        "image_url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg",
                        "public_modules": {},
                        "image_urls": {
                            "url_s": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_s.jpeg",
                            "url_m": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_m.jpeg",
                            "url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg"
                        },
                        "locale": "de",
                        "title": "Skibidi Boxfights!",
                        "matchmakingV2": {
                            "allowJoinInProgress": true,
                            "allowSquadFillOption": false,
                            "maxPlayers": 2,
                            "islandQueuePrivacy": "Unrestricted",
                            "maxSocialPartySize": 2,
                            "maxTeamCount": 2,
                            "maxTeamSize": 2
                        },
                        "mode": "live",
                        "ratings": {
                            "boards": {
                                "ACB": {
                                    "descriptors": [
                                        "ACB_MildViolence",
                                        "ACB_ScaryScenes",
                                        "ACB_GEMCO"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "ACB_AGE_PG",
                                    "initial_rating": "ACB_AGE_PG",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "PEGI": {
                                    "descriptors": [
                                        "PEGI_ModerateViolence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "PEGI_AGE_12",
                                    "initial_rating": "PEGI_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "Generic": {
                                    "descriptors": [
                                        "GEN_ModerateViolence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "GEN_AGE_12",
                                    "initial_rating": "GEN_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "ClassInd": {
                                    "descriptors": [
                                        "ClassInd_Violencia"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "CLASSIND_AGE_12",
                                    "initial_rating": "CLASSIND_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "USK": {
                                    "descriptors": [
                                        "USK_FantasyGewalt_v9_0"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "USK_AGE_12",
                                    "initial_rating": "USK_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "GRAC": {
                                    "descriptors": [
                                        "GRAC_Violence_v7_1",
                                        "GRAC_Fear_v7_1"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "GRAC_AGE_ALL",
                                    "initial_rating": "GRAC_AGE_ALL",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "ESRB": {
                                    "descriptors": [
                                        "ESRB_Violence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "ESRB_AGE_T",
                                    "initial_rating": "ESRB_AGE_T",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "Russia": {
                                    "descriptors": [
                                        "RUS_Violence_v7_0"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "RUSSIA_AGE_16",
                                    "initial_rating": "RUSSIA_AGE_16",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                }
                            }
                        },
                        "dynamicXp": {
                            "uniqueGameVersion": 220,
                            "calibrationPhase": "LiveXp"
                        },
                        "tagline": "✔ skibidi Boxfights\n✔ Always Updated\n✔ Made By ObsessedTech (AKA: Pongo_x86)\n\nFind skibidi toilets through matchmaking!",
                        "square_image_urls": {
                            "url_s": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_s.jpeg",
                            "url_m": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_m.jpeg",
                            "url": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square.jpeg"
                        },
                        "supportCode": "raider464",
                        "projectId": "01bc143d-330e-4292-b941-86fb24d042f0",
                        "introduction": "\n\n",
                        "attributions": []
                    },
                    "version": 220,
                    "active": true,
                    "disabled": false,
                    "created": "2024-12-11T03:49:25.334Z",
                    "published": "2020-11-03T18:58:25.865Z",
                    "descriptionTags": [
                        "1v1",
                        "competitive",
                        "practice",
                        "building"
                    ],
                    "moderationStatus": "Approved",
                    "lastActivatedDate": "2024-12-11T03:50:20.646Z",
                    "discoveryIntent": "PUBLIC",
                    "linkState": "LIVE"
                },
                "1832-0469-4852": {
                    "namespace": "fn",
                    "accountId": "bcbeb118-9f98-41fb-b049-7a5cde8b19cd",
                    "creatorName": "Pongo_x86",
                    "mnemonic": "1832-0469-4852",
                    "linkType": "valkyrie:application",
                    "metadata": {
                        "quicksilver_id": "cd0bb5ad-561e-459a-8a41-8f99b28490a8",
                        "gameFeaturesets": [],
                        "image_url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg",
                        "public_modules": {},
                        "image_urls": {
                            "url_s": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_s.jpeg",
                            "url_m": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp_m.jpeg",
                            "url": "https://cdn-0001.qstv.on.epicgames.com/DvHxvhVqJouxUDkEkx/image/landscape_comp.jpeg"
                        },
                        "locale": "en",
                        "title": "Sigma Boxfights!",
                        "matchmakingV2": {
                            "allowJoinInProgress": true,
                            "allowSquadFillOption": false,
                            "maxPlayers": 2,
                            "islandQueuePrivacy": "Unrestricted",
                            "maxSocialPartySize": 2,
                            "maxTeamCount": 2,
                            "maxTeamSize": 2
                        },
                        "mode": "live",
                        "ratings": {
                            "boards": {
                                "ACB": {
                                    "descriptors": [
                                        "ACB_MildViolence",
                                        "ACB_ScaryScenes",
                                        "ACB_GEMCO"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "ACB_AGE_PG",
                                    "initial_rating": "ACB_AGE_PG",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "PEGI": {
                                    "descriptors": [
                                        "PEGI_ModerateViolence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "PEGI_AGE_12",
                                    "initial_rating": "PEGI_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "Generic": {
                                    "descriptors": [
                                        "GEN_ModerateViolence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "GEN_AGE_12",
                                    "initial_rating": "GEN_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "ClassInd": {
                                    "descriptors": [
                                        "ClassInd_Violencia"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "CLASSIND_AGE_12",
                                    "initial_rating": "CLASSIND_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "USK": {
                                    "descriptors": [
                                        "USK_FantasyGewalt_v9_0"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "USK_AGE_12",
                                    "initial_rating": "USK_AGE_12",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "GRAC": {
                                    "descriptors": [
                                        "GRAC_Violence_v7_1",
                                        "GRAC_Fear_v7_1"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "GRAC_AGE_ALL",
                                    "initial_rating": "GRAC_AGE_ALL",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "ESRB": {
                                    "descriptors": [
                                        "ESRB_Violence"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "ESRB_AGE_T",
                                    "initial_rating": "ESRB_AGE_T",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                },
                                "Russia": {
                                    "descriptors": [
                                        "RUS_Violence_v7_0"
                                    ],
                                    "rating_overridden": false,
                                    "rating": "RUSSIA_AGE_16",
                                    "initial_rating": "RUSSIA_AGE_16",
                                    "interactive_elements": [
                                        "IE_UsersInteract"
                                    ]
                                }
                            }
                        },
                        "dynamicXp": {
                            "uniqueGameVersion": 220,
                            "calibrationPhase": "LiveXp"
                        },
                        "tagline": "✔ Sigma Boxfights\n✔ Always Updated\n✔ Made By ObsessedTech (AKA: Pongo_x86)\n\nFind Sigmas through matchmaking!",
                        "square_image_urls": {
                            "url_s": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_s.jpeg",
                            "url_m": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square_m.jpeg",
                            "url": "https://cdn-0001.qstv.on.epicgames.com/KvzegFLoqCAHhgzTox/image/square.jpeg"
                        },
                        "supportCode": "raider464",
                        "projectId": "01bc143d-330e-4292-b941-86fb24d042f0",
                        "introduction": "\n\n",
                        "attributions": []
                    },
                    "version": 220,
                    "active": true,
                    "disabled": false,
                    "created": "2024-12-11T03:49:25.334Z",
                    "published": "2020-11-03T18:58:25.865Z",
                    "descriptionTags": [
                        "1v1",
                        "competitive",
                        "practice",
                        "building"
                    ],
                    "moderationStatus": "Approved",
                    "lastActivatedDate": "2024-12-11T03:50:20.646Z",
                    "discoveryIntent": "PUBLIC",
                    "linkState": "LIVE"
                }
            }
        })
    })
}

module.exports = mnemonic;