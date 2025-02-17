const errors = require("../../responses/errors.json");
const createError = require("../../utils/error");

const functions = require("../../utils/functions");

function getFortniteGame(memory) {
    const contentpages = require("../../responses/fortniteConfig/content/fortnite-game.json");

    // backgrounds
    const backgrounds = contentpages.dynamicbackgrounds.backgrounds.backgrounds;
    const season = `season${memory.season}${memory.season >= 21 ? "00" : ""}`;
    backgrounds[0].stage = season;
    backgrounds[1].stage = season;

    if (memory.season == 10) {
        backgrounds[0].stage = "seasonx";
        backgrounds[1].stage = "seasonx";
    } else if (memory.build == 11.31 || memory.build == 11.40) {
        backgrounds[0].stage = "Winter19";
        backgrounds[1].stage = "Winter19";
    } else if (memory.season == 12) {
        backgrounds[0].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/c2s2Lobby.png";
        backgrounds[1].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/c2s2Lobby.png";
    } else if (memory.build == 19.01) {
        backgrounds[0].stage = "winter2021";
        contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
    } else if (memory.season == 20) {
        if (memory.build == 20.40) {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg"
        } else {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png";
        }
    } else if (memory.season == 21) {
        backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg"

        if (memory.build == 21.10) {
            backgrounds[0].stage = "season2100";
        }
        if (memory.build == 21.30) {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/nss-lobbybackground-2048x1024-f74a14565061.jpg"
            cbackgrounds[0].stage = "season2130";
        }
    } else if (memory.season == 22) {
        backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp22-lobby-square-2048x2048-2048x2048-e4e90c6e8018.jpg"
    } else if (memory.season == 23) {
        if (memory.build == 23.10) {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp23-winterfest-lobby-square-2048x2048-2048x2048-277a476e5ca6.png"
            contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
        } else {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png";
        }
    } else if (memory.season == 24) {
        backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg"
    } else if (memory.season == 25) {
        backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/s25-lobby-4k-4096x2048-4a832928e11f.jpg"
        backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/fn-shop-ch4s3-04-1920x1080-785ce1d90213.png"

        if (memory.build == 25.11) {
            backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-s25-14dos-lobby-4096x2048-2be24969eee3.jpg"
        }
    } else if (memory.season == 27) {
        backgrounds[0].stage = "rufus";
    } else {
        backgrounds[0].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/lightlobbybg.png";
        backgrounds[1].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/lightlobbybg.png";
    }
    contentpages.dynamicbackgrounds.backgrounds.backgrounds = backgrounds;

    // news
    /*const items = [
        {
            image: "https://cdn2.unrealengine.com/s25-lobby-4k-4096x2048-4a832928e11f.jpg",
            title: "Keep Your Account Secure",
            description: "Avoid scam sites offering free V-Bucks. Epic will never ask for your password. Enable Two-Factor Authentication to help stay secure!"
        },
        {
            image: "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png",
            title: "ArcaneV5, Powering better multiplayer experiences than before!",
            description: "Keep Your Account Secure"
        },
        {
            image: "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg",
            title: "Welcome to Arcane Backend",
            description: "Welcome to Arcane Backend \n We hope you have an amazing experience!"
        },
        {
            image: "https://cdn2.unrealengine.com/t-bp23-lobby-2048x1024-2048x1024-26f2c1b27f63.png",
            title: "RetroNite is free",
            description: "RetroNite is free"
        },
        {
            image: "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg",
            title: "Thanks for using ArcaneV5",
            description: "Thanks for using ArcaneV5 \n We hope you have an amazing experience!"
        },
        {
            image: "https://cdn2.unrealengine.com/t-bp19-lobby-xmas-2048x1024-f85d2684b4af.png",
            title: "Thanks for choosing Arcane Backend!",
            description: "Thanks for choosing Arcane Backend! \n We hope you have an amazing experience!"
        }
    ];

    const shuffledArray = [...items].sort(() => 0.5 - Math.random());
    const slicedArray = shuffledArray.slice(0, 2);

    let newsv1 = [];
    for (let i = 0; i < slicedArray.length; i++) {
        newsv1.push({
            "image": slicedArray[i].image,
            "hidden": false,
            "messagetype": "normal",
            "_type": "CommonUI Simple Message Base",
            "title": slicedArray[i].title,
            "body": slicedArray[i].description,
            "spotlight": false
        });
    }*/
    /*let newsv1 = [
        {
            "image": "https://cdn.evolvefn.com/EvolveLogo.png",
            "hidden": false,
            "messagetype": "normal",
            "_type": "CommonUI Simple Message Base",
            "title": "Evolve Release!",
            "body": "Welcome to Evolve, We hope you have an amazing experience!",
            "spotlight": false
        },
        {
            "image": "https://cdn.evolvefn.com/arcane.png",
            "hidden": false,
            "messagetype": "normal",
            "_type": "CommonUI Simple Message Base",
            "title": "ArcaneV5",
            "body": "Evolve is powered by the Arcane Backend!",
            "spotlight": false
        },
    ]

    content.battleroyalenews.news.messages = newsv1;
    content.creativenews.news.messages = newsv1;
    content.savetheworldnews.news.messages = newsv1;*/

    return contentpages;
}

async function content(fastify, options) {
    fastify.get('/content/api/pages/fortnite-game', (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        reply.status(200).send(getFortniteGame(memory));
    });

    fastify.get('/content/api/pages/fortnite-game/', (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        reply.status(200).send(getFortniteGame(memory));
    });

    fastify.get('/content/api/pages/fortnite-game/spark-tracks', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/content/spark-tracks.json"));
    });

    fastify.get('/content/api/pages/fortnite-game/seasonpasses', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/content/seasonpasses.json"));
    });

    fastify.get('/content/api/pages/ALL', (request, reply) => {
        const content = require("../../responses/fortniteConfig/content/fortnite-game.json");
        const memory = functions.GetVersionInfo(request);

        // backgrounds
        const backgrounds = content.dynamicbackgrounds.backgrounds.backgrounds;
        const season = `season${memory.season}${memory.season >= 21 ? "00" : ""}`;
        backgrounds[0].stage = season;
        backgrounds[1].stage = season;

        reply.status(200).send(content);
    });

    fastify.get('/content/api/pages/fortnite-game/:subkey', (request, reply) => {
        const content = require("../../responses/fortniteConfig/content/fortnite-game.json");
        if (content[request.params.subkey]) {
            return reply.status(200).send(content[request.params.subkey]);
        } else {
            return reply.status(404).send();
        }
    })

    fastify.get('/content/api/pages/:page*', (request, reply) => {
        const content = require(`../../responses/fortniteConfig/content/${request.params.page}.json`);
        if (content) {
            return reply.status(200).send(content);
        } else {
            return reply.status(404).send();
        }
    })

    fastify.post('/api/v1/fortnite-br/channel/motd/target', (request, reply) => {
        reply.status(200).send({
            "contentItems": [
                {
                    "contentHash": "98f39f4187e219ca3cd00cafa524ef9c",
                    "contentSchemaName": "DynamicMotd",
                    "contentFields": {
                        "Buttons": [
                            {
                                "Action": {
                                    "_type": "MotdNavigateToShopAction",
                                    "navAction": "1",
                                    "offerTrackingId": "/OfferCatalog/NewDisplayAssets/S33/DAv2_Bundle_Featured_CoconutShell.DAv2_Bundle_Featured_CoconutShell"
                                },
                                "Style": "0",
                                "Text": "Check Them Out",
                                "_type": "Button"
                            }
                        ],
                        "FullScreenBackground": {
                            "Image": [
                                {
                                    "width": 1920,
                                    "height": 1080,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/542911dd38035491b13c9a67ca46e168967578bd14509dbeb2c4fa6429a49390d9b229d24e5a95757b6e1939522a075f-3a753811-fcde-45c4-9278-c010f917d56e.jpeg?width=1920&height=1080&aspect=fill"
                                },
                                {
                                    "width": 960,
                                    "height": 540,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/542911dd38035491b13c9a67ca46e168967578bd14509dbeb2c4fa6429a49390d9b229d24e5a95757b6e1939522a075f-3a753811-fcde-45c4-9278-c010f917d56e.jpeg?width=960&height=540&aspect=fill"
                                }
                            ],
                            "_type": "FullScreenBackground"
                        },
                        "FullScreenBody": "Set your sights on a new mission with outfits of Pandora's protectors, Jake Sully and Neytiri.",
                        "FullScreenTitle": "Avatar: Warriors of Pandora",
                        "TeaserBackground": {
                            "Image": [
                                {
                                    "width": 720,
                                    "height": 400,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/542911dd38035491b13c9a67ca46e168f41947d4db9b46213d9fdaecdbda36e737d338c67e20bd1f2ba0cbda6c43b755-a58968f3-958e-4c8a-9245-802e0fcc7abd.jpeg?width=720&height=400&aspect=fill"
                                }
                            ],
                            "Video": {
                                "Autoplay": true,
                                "EndTime": 8,
                                "ShouldLoop": true,
                                "StartTime": 2,
                                "StreamingEnabled": true,
                                "UID": "zXZrOqEIQpWTulJPzQ",
                                "VideoString": "PandoraAvatar_MiniClip",
                                "_type": "Video"
                            },
                            "_type": "TeaserBackground"
                        },
                        "TeaserTitle": "Avatar: Warriors of Pandora",
                        "VerticalTextLayout": false
                    },
                    "placements": [
                        {
                            "trackingId": "ebb11710-1a68-4a3d-be9f-7e289968eba7",
                            "tag": "Product.FNE.1832-0431-4852",
                            "locations": [],
                            "position": 1
                        }
                    ]
                },
                {
                    "contentHash": "919033257e620f3a8239e9632d1a25a7",
                    "contentSchemaName": "DynamicMotd",
                    "contentFields": {
                        "Buttons": [
                            {
                                "Action": {
                                    "_type": "MotdIslandSelectAction",
                                    "linkId": "set_figment_playlists"
                                },
                                "Style": "0",
                                "Text": "Play Now",
                                "_type": "Button"
                            }
                        ],
                        "FullScreenBackground": {
                            "Image": [
                                {
                                    "width": 1920,
                                    "height": 1080,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/05a8a458e2ba621679b1828f62bf3b32e9d7346e60d4766c20f4ce52fc13bec17f4fc00b24cb38f06c4d6261ad9183b614e44f0f617e6c8c5ffb9abbdcf4be9e-2afeaa9b-6373-47af-849c-33ef7e5b0637.jpeg?width=1920&height=1080&aspect=fill"
                                },
                                {
                                    "width": 960,
                                    "height": 540,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/05a8a458e2ba621679b1828f62bf3b32e9d7346e60d4766c20f4ce52fc13bec17f4fc00b24cb38f06c4d6261ad9183b614e44f0f617e6c8c5ffb9abbdcf4be9e-2afeaa9b-6373-47af-849c-33ef7e5b0637.jpeg?width=960&height=540&aspect=fill"
                                }
                            ],
                            "_type": "FullScreenBackground"
                        },
                        "FullScreenBody": "Jump into Fortnite OG this weekend to find the legendary Zapotron sniper rifle from Supply Drops for a limited time!",
                        "FullScreenTitle": "The Zapotron Returns",
                        "TeaserBackground": {
                            "Image": [
                                {
                                    "width": 720,
                                    "height": 400,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/05a8a458e2ba621679b1828f62bf3b32e9d7346e60d4766c20f4ce52fc13bec17f4fc00b24cb38f06c4d6261ad9183b6174ec1f12d0471458b7cfd4244962fc5-ad4620f9-0e08-451b-8f6a-c35d795c004a.jpeg?width=720&height=400&aspect=fill"
                                }
                            ],
                            "_type": "TeaserBackground"
                        },
                        "TeaserTitle": "The Zapotron Returns",
                        "VerticalTextLayout": false
                    },
                    "placements": [
                        {
                            "trackingId": "6e776952-1c05-45ab-ad37-7c0efb00aa87",
                            "tag": "Product.FNE.1832-0431-4852",
                            "locations": [],
                            "position": 0
                        }
                    ]
                },
                {
                    "contentHash": "b1352f8a8f9d0a2644b8ec69c4c27c57",
                    "contentSchemaName": "DynamicMotd",
                    "contentFields": {
                        "Buttons": [
                            {
                                "Action": {
                                    "_type": "MotdIslandSelectAction",
                                    "linkId": "4781-1197-6847"
                                },
                                "Style": "0",
                                "Text": "Play Now",
                                "_type": "Button"
                            }
                        ],
                        "FullScreenBackground": {
                            "Image": [
                                {
                                    "width": 1920,
                                    "height": 1080,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/4d333a59841c3c7902dceabc1e94af8a0d7f1635ac77d771f4622b612bc687c481d21dc0dce6dce65ccdbe4872331760-ca3915bc-236d-4181-999f-18a8d8222652.jpeg?width=1920&height=1080&aspect=fill"
                                },
                                {
                                    "width": 960,
                                    "height": 540,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/4d333a59841c3c7902dceabc1e94af8a0d7f1635ac77d771f4622b612bc687c481d21dc0dce6dce65ccdbe4872331760-ca3915bc-236d-4181-999f-18a8d8222652.jpeg?width=960&height=540&aspect=fill"
                                }
                            ],
                            "_type": "FullScreenBackground"
                        },
                        "FullScreenBody": "Embark on an epic cave adventure, recruit and empower allies, and challenge ferocious bosses in Miner Tycoon, created by blzn.  ",
                        "FullScreenTitle": "Miner Tycoon",
                        "TeaserBackground": {
                            "Image": [
                                {
                                    "width": 720,
                                    "height": 400,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/88bf75c4bdbcfde9d0dcd935f9cfcb5fa5da12bc668f1fc5031cd853ccfae7cea566ca94cb6658747f478d3ec454dd24-dbca03b3-ce70-41cc-983a-bccd4d5ceded.jpeg?width=720&height=400&aspect=fill"
                                }
                            ],
                            "_type": "TeaserBackground"
                        },
                        "TeaserTitle": "Miner Tycoon",
                        "VerticalTextLayout": false
                    },
                    "placements": [
                        {
                            "trackingId": "0490a10e-4499-4757-bfc3-10c98669faf4",
                            "tag": "Product.FNE.1832-0431-4852",
                            "locations": [],
                            "position": 3
                        }
                    ]
                },
                {
                    "contentHash": "23802977b1c3877f6d9e150c69ebb385",
                    "contentSchemaName": "DynamicMotd",
                    "contentFields": {
                        "Buttons": [
                            {
                                "Action": {
                                    "_type": "MotdNavigateToShopAction",
                                    "navAction": "1",
                                    "offerTrackingId": "/OfferCatalog/NewDisplayAssets/S33/DAv2_Bundle_Featured_SleekRivet.DAv2_Bundle_Featured_SleekRivet"
                                },
                                "Style": "0",
                                "Text": "Check It Out",
                                "_type": "Button"
                            }
                        ],
                        "FullScreenBackground": {
                            "Image": [
                                {
                                    "width": 1920,
                                    "height": 1080,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/487deac9793a0bc2dd8e97f41da4f94f6b8a7aa0162f1ddb8a3a8ecf01d151282710d75f5bd38603d3adc53d43a9e99ee469655ea66f247643cea96bdd3d0cb1-8e0ebd0b-7fc5-4e8a-9d17-01a02f61245e.jpeg?width=1920&height=1080&aspect=fill"
                                },
                                {
                                    "width": 960,
                                    "height": 540,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/487deac9793a0bc2dd8e97f41da4f94f6b8a7aa0162f1ddb8a3a8ecf01d151282710d75f5bd38603d3adc53d43a9e99ee469655ea66f247643cea96bdd3d0cb1-8e0ebd0b-7fc5-4e8a-9d17-01a02f61245e.jpeg?width=960&height=540&aspect=fill"
                                }
                            ],
                            "_type": "FullScreenBackground"
                        },
                        "FullScreenBody": "You're in his territory now.",
                        "FullScreenTitle": "Boss Kōji",
                        "TeaserBackground": {
                            "Image": [
                                {
                                    "width": 720,
                                    "height": 400,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/487deac9793a0bc2dd8e97f41da4f94f6b8a7aa0162f1ddb8a3a8ecf01d15128d4cda19e4b208ed28a6f6e78d868ee6d6d47aac444d27cff94aeb0a0f057b790-b09c3101-2389-42e1-8b99-3898ad71e5c8.jpeg?width=720&height=400&aspect=fill"
                                }
                            ],
                            "_type": "TeaserBackground"
                        },
                        "TeaserTitle": "Boss Kōji",
                        "VerticalTextLayout": false
                    },
                    "placements": [
                        {
                            "trackingId": "487a214c-64ef-43a4-912b-df620471feb5",
                            "tag": "Product.FNE.1832-0431-4852",
                            "locations": [],
                            "position": 4
                        }
                    ]
                },
                {
                    "contentHash": "8e452c67b3b3794cdeca5c99e6ea658b",
                    "contentSchemaName": "DynamicMotd",
                    "contentFields": {
                        "Buttons": [
                            {
                                "Action": {
                                    "_type": "MotdNavigateToShopAction",
                                    "navAction": "2",
                                    "offerTrackingId": "/OfferCatalog/NewDisplayAssets/S33/DAv2_Shoes_PacketCrescentCocoa.DAv2_Shoes_PacketCrescentCocoa"
                                },
                                "Style": "0",
                                "Text": "Check Them Out",
                                "_type": "Button"
                            }
                        ],
                        "FullScreenBackground": {
                            "Image": [
                                {
                                    "width": 1920,
                                    "height": 1080,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/4f6275aaaa9731e6e4dafdebb0af7f002d0d79fd1e4b07b44df14fbd1fb212ec818bfe1b97c1e9a6fcefb84dda2e2e627b50a415f6aabef7ed9ee8262341acad-a4a36de9-5130-4a8b-85df-d302f59e0699.jpeg?width=1920&height=1080&aspect=fill"
                                },
                                {
                                    "width": 960,
                                    "height": 540,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/4f6275aaaa9731e6e4dafdebb0af7f002d0d79fd1e4b07b44df14fbd1fb212ec818bfe1b97c1e9a6fcefb84dda2e2e627b50a415f6aabef7ed9ee8262341acad-a4a36de9-5130-4a8b-85df-d302f59e0699.jpeg?width=960&height=540&aspect=fill"
                                }
                            ],
                            "_type": "FullScreenBackground"
                        },
                        "FullScreenBody": "Kick it in style with the adidas Samba OG 'White,' Anthony Edwards 1 Low 'Champagne Metallic,' and the Anthony Edwards 1 Low 'Nick's Gift' Kicks.",
                        "FullScreenTitle": "New Adidas Kicks",
                        "TeaserBackground": {
                            "Image": [
                                {
                                    "width": 720,
                                    "height": 400,
                                    "url": "https://cdn-live.prm.ol.epicgames.com/prod/4f6275aaaa9731e6e4dafdebb0af7f002d0d79fd1e4b07b44df14fbd1fb212ecad811fb43ffb301fe63319f8da1c7dc27c09edcea516d378dac0fec956acf5c2-b1009d3f-f565-4805-8116-f9659bf69f39.jpeg?width=720&height=400&aspect=fill"
                                }
                            ],
                            "_type": "TeaserBackground"
                        },
                        "TeaserTitle": "New Adidas Kicks",
                        "VerticalTextLayout": false
                    },
                    "placements": [
                        {
                            "trackingId": "bab9be3c-48de-45cf-b8ed-ea4821fb51ad",
                            "tag": "Product.FNE.1832-0431-4852",
                            "locations": [],
                            "position": 2
                        }
                    ]
                }
            ],
            "tcId": "7dc15561-0b41-4775-ba75-d243e1139cbe"
        });
    })
}

module.exports = content
