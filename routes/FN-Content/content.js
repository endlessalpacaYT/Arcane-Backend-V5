const errors = require("../../responses/errors.json");
const createError = require("../../utils/error");

const functions = require("../../utils/functions");

async function content(fastify, options) {
    fastify.get('/content/api/pages/fortnite-game', (request, reply) => {
        const content = require("../../responses/fortniteConfig/fortnite-game.json");
        const memory = functions.GetVersionInfo(request);
    
        // backgrounds
        const backgrounds = content.dynamicbackgrounds.backgrounds.backgrounds;
        const season = `season${memory.season}${memory.season >= 21 ? "00" : ""}`;
        backgrounds[0].stage = season;
        backgrounds[1].stage = season;
    
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

        reply.status(200).send(content);
    });

    fastify.get('/content/api/pages/fortnite-game/:subkey', (request, reply) => {
        const content = require("../../responses/fortniteConfig/fortnite-game.json");
        if (content[request.params.subkey]) {
            return reply.status(200).send(content[request.params.subkey]);
        } else {
            return createError.createError(errors.NOT_FOUND.common, 404, reply);
        }
    })
}

module.exports = content
