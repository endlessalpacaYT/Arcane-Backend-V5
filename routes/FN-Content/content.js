const errors = require("../../responses/errors.json");
const createError = require("../../utils/error");

const functions = require("../../utils/functions");

const seasonalNews = require("../../responses/fortniteConfig/content/seasonalNews.json");

function getFortniteGame(memory) {
    const contentpages = require("../../responses/fortniteConfig/content/fortnite-game.json");

    // backgrounds
    let backgrounds = contentpages.dynamicbackgrounds.backgrounds.backgrounds;
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
        backgrounds = [
            {
                "stage": "default",
                "_type": "DynamicBackground",
                "key": "vault"
            },
            {
                "stage": "season2100",
                "_type": "DynamicBackground",
                "key": "lobby",
                "backgroundimage": "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg"
            }
        ]
        
        if (memory.build == 21.30) {
            backgrounds[1].backgroundimage = "https://cdn2.unrealengine.com/nss-lobbybackground-2048x1024-f74a14565061.jpg"
            backgrounds[1].stage = "season2130";
        }
    } else if (memory.season == 22) {
        backgrounds = [
            {
                "stage": "default",
                "_type": "DynamicBackground",
                "key": "vault"
            },
            {
                "stage": "season2200",
                "_type": "DynamicBackground",
                "key": "lobby",
                "backgroundimage": "https://cdn2.unrealengine.com/t-bp22-lobby-square-2048x2048-2048x2048-e4e90c6e8018.jpg"
            }
        ]
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
    } else if (memory.season == 26) {
        if (memory.build == 26.30) {
            backgrounds = [
                {
                    "stage": "default",
                    "_type": "DynamicBackground",
                    "key": "vault"
                },
                {
                    "stage": "season2630",
                    "_type": "DynamicBackground",
                    "key": "lobby",
                    "backgroundimage": "https://cdn2.unrealengine.com/s26-lobby-timemachine-final-2560x1440-a3ce0018e3fa.jpg"
                }
            ]
        }
    } else if (memory.season == 27) {
        backgrounds[0].stage = "rufus";
    } else if (memory.season == 28) {
        backgrounds = [
            {
                "backgroundimage": "https://cdn2.unrealengine.com/ch5s1-lobbybg-3640x2048-0974e0c3333c.jpg",
                "stage": "defaultnotris",
                "_type": "DynamicBackground",
                "key": "lobby"
            },
            {
                "stage": "default",
                "_type": "DynamicBackground",
                "key": "vault"
            }
        ]
    } else if (memory.season == 34) {
        backgrounds = [
            {
                "backgroundimage": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/mkart-fnbr-ch6s2-34-00-lobby-2048x1024-16b9f3791e2a.jpg",
                "stage": "season3400",
                "_type": "DynamicBackground",
                "key": "lobby"
            },
            {
                "stage": "default",
                "_type": "DynamicBackground",
                "key": "vault"
            }
        ]
    } else {
        backgrounds[0].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/lightlobbybg.png";
        backgrounds[1].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/lightlobbybg.png";
    }
    contentpages.dynamicbackgrounds.backgrounds.backgrounds = backgrounds;

    contentpages.battleroyalenews.news.motds = [
        {
            "entryType": "Website",
            "image": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
            "tileImage": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5.png",
            "videoMute": false,
            "hidden": false,
            "tabTitleOverride": "Welcome To ArcaneV5!",
            "_type": "CommonUI Simple Message MOTD",
            "title": "Welcome To ArcaneV5!",
            "body": "Welcome to ArcaneV5, Powering better multiplayer experiences than before!",
            "offerAction": "ShowOfferDetails",
            "videoLoop": false,
            "videoStreamingEnabled": false,
            "sortingPriority": 1,
            "websiteButtonText": "Check it out!",
            "websiteURL": "https://github.com/endlessalpacaYT/Arcane-Backend-V5",
            "id": "ArcaneV5",
            "videoAutoplay": false,
            "videoFullscreen": false,
            "spotlight": true
        }
    ];
    if (memory.build >= 5.30) {
        contentpages.battleroyalenews.news.messages = [
            {
                "image": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/ArcaneV5Big.png",
                "hidden": false,
                "_type": "CommonUI Simple Message Base",
                "adspace": "ARCANEV5!",
                "title": "Welcome To ArcaneV5!",
                "body": "Welcome to ArcaneV5, Powering better multiplayer experiences than before!",
                "spotlight": true
            }
        ];
    } else {
        contentpages.battleroyalenews.news.messages = [
            {
                "image": "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/arcane.png",
                "hidden": false,
                "_type": "CommonUI Simple Message Base",
                "adspace": "ARCANEV5!",
                "title": "Welcome To ArcaneV5!",
                "body": "Welcome to ArcaneV5, Powering better multiplayer experiences than before!",
                "spotlight": true
            }
        ];
    }

    if (memory.season == 11) {
        for (let i = 0; i < seasonalNews.news[11].length; i++) {
            contentpages.battleroyalenews.news.motds.push(seasonalNews.news[11][i]);
        }

        if (memory.build == 11.31) {
            for (let i = 0; i < seasonalNews.news["11.31"].length; i++) {
                contentpages.battleroyalenews.news.motds.push(seasonalNews.news["11.31"][i]);
            }
        }
    } else if (memory.season == 12) {
        for (let i = 0; i < seasonalNews.news[12].length; i++) {
            contentpages.battleroyalenews.news.motds.push(seasonalNews.news[12][i]);
        }

        if (memory.build == 12.41) {
            for (let i = 0; i < seasonalNews.news["12.41"].length; i++) {
                contentpages.battleroyalenews.news.motds.push(seasonalNews.news["12.41"][i]);
            }
        } else if (memory.build == 12.61) {
            for (let i = 0; i < seasonalNews.news["12.61"].length; i++) {
                contentpages.battleroyalenews.news.motds.push(seasonalNews.news["12.61"][i]);
            }
        }
    }

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

    fastify.get('/content/api/pages/launcher-news', (request, reply) => {
        return reply.status(200).send({
            news: {
                messages: [
                    {
                        title: "Welcome to Evolve!",
                        body: "Welcome to Evolve, We hope you have an amazing experience!"
                    }
                ]
            }
        });
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
        const motdTarget = require("../../responses/fortniteConfig/motdTarget.json");

        reply.status(200).send(motdTarget);
    })
}

module.exports = content
