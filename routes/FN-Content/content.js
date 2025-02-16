const errors = require("../../responses/errors.json");
const createError = require("../../utils/error");

const functions = require("../../utils/functions");

function getFortniteGame(memory) {
    const content = require("../../responses/fortniteConfig/content/fortnite-game.json");

    // backgrounds
    const backgrounds = content.dynamicbackgrounds.backgrounds.backgrounds;
    const season = `season${memory.season}${memory.season >= 21 ? "00" : ""}`;
    backgrounds[0].stage = season;
    backgrounds[1].stage = season;

    if (memory.season == 10) {
        backgrounds[0].stage = "seasonx";
        backgrounds[1].stage = "seasonx";
    } else if (memory.build == 11.31 || memory.build == 11.40) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "Winter19";
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "Winter19";
    } else if (memory.build == 19.01) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "winter2021";
        contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
    } else if (memory.season == 20) {
        if (memory.build == 20.40) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg"
        } else {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png";
        }
    } else if (memory.season == 21) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg"

        if (memory.build == 21.10) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "season2100";
        }
        if (memory.build == 21.30) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/nss-lobbybackground-2048x1024-f74a14565061.jpg"
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "season2130";
        }
    } else if (memory.season == 22) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp22-lobby-square-2048x2048-2048x2048-e4e90c6e8018.jpg"
    } else if (memory.season == 23) {
        if (memory.build == 23.10) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp23-winterfest-lobby-square-2048x2048-2048x2048-277a476e5ca6.png"
            contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
        } else {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png";
        }
    } else if (memory.season == 24) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg"
    } else if (memory.season == 25) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/s25-lobby-4k-4096x2048-4a832928e11f.jpg"
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/fn-shop-ch4s3-04-1920x1080-785ce1d90213.png"

        if (memory.build == 25.11) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-s25-14dos-lobby-4096x2048-2be24969eee3.jpg"
        }
    } else if (memory.season == 27) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "rufus";
    } else {
        backgrounds[0].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/c2s2Lobby.png";
        backgrounds[1].backgroundimage = "https://fortnite-public-service-prod11.ol.epicgames.com/imagecdn/c2s2Lobby.png";
    }
    content.dynamicbackgrounds.backgrounds.backgrounds = backgrounds;

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

    return content;
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
}

module.exports = content
