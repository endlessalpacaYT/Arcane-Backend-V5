const crypto = require("crypto");

const cosmetics = require("../responses/fortniteConfig/catalog/br.json");
const functions = require("./functions")

const CatalogConfig = {
    "daily": [],
    "featured": []
};
async function filterCosmetics(filter) {
    return cosmetics.data.filter(filter);
}

function priceGen(item) {
    const rarity = {
        frozen: {
            backpack: 1500,
        },
        slurp: {
            pickaxe: 1500,
        },
        starwars: {
            outfit: 1500,
        },
        dark: {
            outfit: 2000,
            pickaxe: 1500,
        },
        dc: {
            emote: 1500,
            pickaxe: 1500,
        },
        marvel: {
            outfit: 3000,
            glider: 2500,
            pickaxe: 2000,
            backpack: 1500,
            spray: 950
        },
        icon: {
            outfit: [2200, 2000],
            emote: 1500,
            spray: 950,
            emoji: 1000,
            backpack: 1500,
            music: 500
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
            toy: 500,
            petcarrier: 400,
            emote: 800
        },
        rare: {
            outfit: 1200,
            pickaxe: 800,
            glider: 800,
            emote: 500,
            music: 500,
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
    const season = Number(process.env.SEASON);

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

global.dailyEnd;
global.weeklyEnd;

async function generateCatalog() {
    CatalogConfig.daily = [];
    CatalogConfig.featured = [];

    CatalogConfig.daily.push({
        "itemGrants": [process.env.CUSTOM_DAILY_ITEM],
        "price": process.env.CUSTOM_DAILY_ITEM_PRICE
    });

    for (let i = 0; i < 5; i++) {
        const cosmetic = await getCosmetic("daily");
        CatalogConfig.daily.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }

    if (Number(process.env.SEASON) > 10) {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 3; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic2 = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic2.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic2.price + cosmetic3.price) - 200
            });
        }
    } else {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 2; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic2 = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic2.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic2.price + cosmetic3.price) - 200
            });
        }
    }

    global.dailyEnd = new Date(Date.now() + 86400 * 1000).toISOString();
    global.weeklyEnd = new Date(Date.now() + 604800 * 1000).toISOString();
}

async function generateDaily() {
    CatalogConfig.daily = [];

    CatalogConfig.daily.push({
        "itemGrants": [process.env.CUSTOM_DAILY_ITEM],
        "price": process.env.CUSTOM_DAILY_ITEM_PRICE
    });

    for (let i = 0; i < 5; i++) {
        const cosmetic = await getCosmetic("daily");
        CatalogConfig.daily.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }

    global.dailyEnd = new Date(Date.now() + 86400 * 1000).toISOString();
}

async function generateFeatured() {
    CatalogConfig.featured = [];

    if (Number(process.env.SEASON) > 10) {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 3; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic2 = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic2.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic2.price + cosmetic3.price) - 200
            });
        }
    } else {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 2; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic2 = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic2.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic2.price + cosmetic3.price) - 200
            });
        }
    }
    global.weeklyEnd = new Date(Date.now() + 604800 * 1000).toISOString();
}

function getShop() {
    const catalog = require("../responses/fortniteConfig/catalog/catalog.json");

    let dailystorefrontindex = catalog.storefronts.findIndex(p => p.name == ("BRDailyStorefront"));
    let weeklystorefrontindex = catalog.storefronts.findIndex(p => p.name == ("BRWeeklyStorefront"));
    const dailystorefront = catalog.storefronts[dailystorefrontindex];
    dailystorefront.catalogEntries = [];
    const weeklystorefront = catalog.storefronts[weeklystorefrontindex];
    weeklystorefront.catalogEntries = [];
    try {
        const dailyItems = CatalogConfig.daily;
        const featuredItems = CatalogConfig.featured;
        for (let item of dailyItems) {
            const CatalogEntry = { "devName": "", "offerId": "", "fulfillmentIds": [], "dailyLimit": -1, "weeklyLimit": -1, "monthlyLimit": -1, "categories": [], "prices": [{ "currencyType": "MtxCurrency", "currencySubType": "", "regularPrice": 0, "finalPrice": 0, "saleExpiration": "9999-12-02T01:12:00Z", "basePrice": 0 }], "meta": { "SectionId": "Featured", "TileSize": "Small" }, "matchFilter": "", "filterWeight": 0, "appStoreId": [], "requirements": [], "offerType": "StaticPrice", "giftInfo": { "bIsEnabled": true, "forcedGiftBoxTemplateId": "", "purchaseRequirements": [], "giftRecordIds": [] }, "refundable": false, "metaInfo": [{ "key": "SectionId", "value": "Featured" }, { "key": "TileSize", "value": "Small" }], "displayAssetPath": "", "itemGrants": [], "sortPriority": -1, "catalogGroupPriority": 0 };
            let storefront = catalog.storefronts.findIndex(p => p.name == ("BRDailyStorefront"));

            for (let itemGrant of item.itemGrants) {
                if (typeof itemGrant != "string") continue;
                if (itemGrant.length == 0) continue;

                CatalogEntry.requirements.push({
                    "requirementType": "DenyOnItemOwnership",
                    "requiredId": itemGrant,
                    "minQuantity": 1
                });
                CatalogEntry.itemGrants.push({ "templateId": itemGrant, "quantity": 1 });
            }

            CatalogEntry.prices = [{
                "currencyType": "MtxCurrency",
                "currencySubType": "",
                "regularPrice": item.price,
                "finalPrice": item.price,
                "saleExpiration": "9999-12-02T01:12:00Z",
                "basePrice": item.price
            }];

            if (CatalogEntry.itemGrants.length > 0) {
                let uniqueIdentifier = crypto.createHash("sha1").update(`${JSON.stringify(item.itemGrants)}_${item.price}`).digest("hex");

                CatalogEntry.devName = uniqueIdentifier;
                CatalogEntry.offerId = uniqueIdentifier;

                catalog.storefronts[storefront].catalogEntries.push(CatalogEntry);
            }
        }

        for (let item of featuredItems) {
            const CatalogEntry = { "devName": "", "offerId": "", "fulfillmentIds": [], "dailyLimit": -1, "weeklyLimit": -1, "monthlyLimit": -1, "categories": [], "prices": [{ "currencyType": "MtxCurrency", "currencySubType": "", "regularPrice": 0, "finalPrice": 0, "saleExpiration": "9999-12-02T01:12:00Z", "basePrice": 0 }], "meta": { "SectionId": "Featured", "TileSize": "Small" }, "matchFilter": "", "filterWeight": 0, "appStoreId": [], "requirements": [], "offerType": "StaticPrice", "giftInfo": { "bIsEnabled": true, "forcedGiftBoxTemplateId": "", "purchaseRequirements": [], "giftRecordIds": [] }, "refundable": false, "metaInfo": [{ "key": "SectionId", "value": "Featured" }, { "key": "TileSize", "value": "Small" }], "displayAssetPath": "", "itemGrants": [], "sortPriority": -1, "catalogGroupPriority": 0 };
            let storefront = catalog.storefronts.findIndex(p => p.name == ("BRWeeklyStorefront"));

            CatalogEntry.meta.TileSize = "Normal";
            CatalogEntry.metaInfo[1].value = "Normal";

            for (let itemGrant of item.itemGrants) {
                if (typeof itemGrant != "string") continue;
                if (itemGrant.length == 0) continue;

                CatalogEntry.requirements.push({
                    "requirementType": "DenyOnItemOwnership",
                    "requiredId": itemGrant,
                    "minQuantity": 1
                });
                CatalogEntry.itemGrants.push({ "templateId": itemGrant, "quantity": 1 });
            }

            CatalogEntry.prices = [{
                "currencyType": "MtxCurrency",
                "currencySubType": "",
                "regularPrice": item.price,
                "finalPrice": item.price,
                "saleExpiration": "9999-12-02T01:12:00Z",
                "basePrice": item.price
            }];

            if (CatalogEntry.itemGrants.length > 0) {
                let uniqueIdentifier = crypto.createHash("sha1").update(`${JSON.stringify(item.itemGrants)}_${item.price}`).digest("hex");

                CatalogEntry.devName = uniqueIdentifier;
                CatalogEntry.offerId = uniqueIdentifier;

                catalog.storefronts[storefront].catalogEntries.push(CatalogEntry);
            }
        }
    } catch (err) {
        console.error(err);
    }
    return catalog;
}

module.exports = {
    getShop,
    generateCatalog,
    generateDaily,
    generateFeatured
}