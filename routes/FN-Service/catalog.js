const User = require("../../database/models/user.js");
const crypto = require("crypto");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const autoShopConfig = require("../../responses/fortniteConfig/catalog/autoShopConfig.json");
const cosmetics = require("../../responses/fortniteConfig/catalog/br.json");
const functions = require("../../utils/functions.js");
const shop = require("../../utils/shop.js");

const CatalogConfig = {
    "daily": [],
    "featured": []
};

async function filterCosmetics(filter) {
    return cosmetics.data.filter(filter);
}

function priceGen(item) {
    const rarity = {
        dc: {
            emote: 1500
        },
        marvel: {
            outfit: 3000,
            glider: 2500,
            pickaxe: 2000,
            backpack: 1500,
            emote: 1500,
            spray: 950
        },
        icon: {
            outfit: [2200, 2000],
            emote: 1500,
            spray: 950,
            emoji: 1000,
        },
        shadow: {
            outfit: 2500,
            spray: 950,
            wrap: 1200,
        },
        legendary: {
            outfit: [2000, 1800],
            pickaxe: 1500,
            backpack: 900,
            glider: 2000,
            spray: 500
        },
        epic: {
            outfit: 1500,
            pet: 1000,
            pickaxe: [1500, 1200],
            glider: 1200,
            backpack: 700,
            spray: 300,
            wrap: 800,
            petcarrier: 400,
            emote: 800
        },
        rare: {
            outfit: 1200,
            pickaxe: 800,
            glider: 800,
            emote: 500,
            toy: 500,
            backpack: 400,
            spray: 250,
            contrail: 300,
            wrap: 600,
            petcarrier: 300,
            emoji: 300
        },
        uncommon: {
            outfit: 800,
            backpack: 200,
            pickaxe: 500,
            glider: 500,
            emote: 200,
            wrap: 300,
            spray: 200,
            contrail: 200,
            loadingscreen: 200,
            petcarrier: 200,
            emoji: 200
        },
        common: {
            glider: 300,
            pickaxe: 250,
            outfit: 500,
            emote: 150,
            wrap: 200,
            spray: 150
        }
    };

    const rarityPrices = rarity[item.rarity];
    if (!rarityPrices || rarityPrices == undefined) {
        console.error(`Unsupported Cosmetic Rarity: Type: ${item.type}, Rarity: ${item.rarity}`);
        return 999;
    }

    const typePrice = rarityPrices[item.type];
    if (!typePrice || typePrice == undefined) {
        console.error(`Unsupported Cosmetic Type: Type: ${item.type}, Rarity: ${item.rarity}`);
        return 999;
    }

    const price = Array.isArray(typePrice)
        ? functions.getRandomElement(typePrice)
        : typePrice;

    return price;
}

async function getCosmetic(type) {
    const selectedCosmetics = new Set();
    const season = Number(process.env.CATALOG_SEASON);

    const filteredCosmetics = await filterCosmetics(cosmetic => 
        cosmetic.introduction && cosmetic.introduction.backendValue <= season &&
        (type === "featured" ? cosmetic.type.value === "outfit" : cosmetic.type.value !== "outfit") &&
        !selectedCosmetics.has(cosmetic.id)
    );

    if (filteredCosmetics.length === 0) {
        throw new Error("No valid cosmetics found based on the provided criteria.");
    }

    const cosmetic = functions.getRandomElement(filteredCosmetics);
    selectedCosmetics.add(cosmetic.id);

    const cosmeticInfo = {
        "itemGrants": `${cosmetic.type.backendValue}:${cosmetic.id}`,
        "rarity": cosmetic.rarity.value,
        "type": cosmetic.type.value,
        "season": cosmetic.introduction.backendValue
    };
    cosmeticInfo.price = await priceGen(cosmeticInfo);
    return cosmeticInfo;
}

async function generateCatalog() {
    CatalogConfig.daily = [];
    CatalogConfig.featured = [];

    for (let i = 0; i < 6; i++) {
        const cosmetic = await getCosmetic("daily");
        CatalogConfig.daily.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }

    for (let i = 0; i < 2; i++) {
        const cosmetic = await getCosmetic("featured");
        CatalogConfig.featured.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }
}
generateCatalog();

/*for (let i = 0; i < 6; i++) {
    const cosmetic = functions.getRandomElement(autoShopConfig);
    CatalogConfig.daily.push(cosmetic);
}

for (let i = 0; i < 2; i++) {
    const cosmetic = functions.getRandomElement(autoShopConfig);
    CatalogConfig.featured.push(cosmetic);
}*/

async function catalog(fastify, options) {
    fastify.get('/fortnite/api/storefront/v2/catalog', (request, reply) => {
        reply.status(200).send(shop.getShop());
    })

    fastify.get('/catalog/api/shared/bulk/offers', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/catalog/catalog.json"))
    })

    fastify.get('/fortnite/api/storefront/v2/gift/check_eligibility/recipient/:friendId/offer/:offerId', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/catalog/giftEligibility.json"))
    })

    fastify.get('/fortnite/api/storefront/v2/keychain', (request, reply) => {
        reply.status(200).send(require("../../responses/fortniteConfig/catalog/keychain.json"))
    })

    fastify.get('/fortnite/api/receipts/v1/account/:accountId/receipts', { preHandler: tokenVerify }, async (request, reply) => {
        const accountId = request.user.account_id;
        const user = await User.findOne({ 'accountInfo.id': accountId });
        if (!user) {
            return createError.createError(errors.NOT_FOUND.account.not_found, 404, reply);
        }

        reply.status(200).send(user.receipts);
    })
}

module.exports = catalog;