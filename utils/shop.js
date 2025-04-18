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
            outfit: 1500,
            backpack: 200,
            pickaxe: 800,
        },
        slurp: {
            pickaxe: 1000,
        },
        starwars: {
            outfit: 1500,
            backpack: 400,
            pickaxe: 800,
            glider: 1200,
            emote: 500,
        },
        dark: {
            outfit: 1200,
            backpack: 400,
            pickaxe: 800,
        },
        dc: {
            outfit: 1500,
            emote: 500,
            pickaxe: 800,
            glider: 1200,
            spray: 300,
            loadingscreen: 300,
            wrap: 500,
        },
        marvel: {
            outfit: 1500,
            glider: 1200,
            pickaxe: 800,
            backpack: 400,
            spray: 300,
            loadingscreen: 300,
            wrap: 500,
            emote: 300,
        },
        icon: {
            outfit: [2000, 1500],
            emote: [500, 300],
            spray: 200,
            emoji: 200,
            backpack: 400,
            music: 200,
        },
        shadow: {
            outfit: 1500,
            backpack: 400,
            pickaxe: 800,
            wrap: 500,
        },
        lava: {
            outfit: 1600,
            pickaxe: 1000,
            glider: 800,
        },
        gaminglegends: {
            outfit: 1500,
            pickaxe: 800,
            emote: 400,
            glider: 800,
            music: 200,
            wrap: 500,
        },
        legendary: {
            outfit: [2000, 1800],
            pickaxe: 1500,
            glider: 1500,
            backpack: 500,
            wrap: 700,
            emote: 500,
        },
        epic: {
            outfit: 1500,
            pickaxe: [1200, 1500],
            glider: 1200,
            backpack: 400,
            wrap: 500,
            toy: 500,
            emote: 800,
            pet: 1000,
            music: 200,
        },
        rare: {
            outfit: 1200,
            pickaxe: 800,
            glider: 800,
            emote: 500,
            music: 200,
            backpack: 300,
            spray: 300,
            contrail: 400,
            wrap: 500,
            emoji: 200,
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
            emoji: 200,
        },
        common: {
            outfit: 600,
            emote: 200,
            wrap: 200,
            spray: 150,
        }
    };

    const rarityPrices = rarity[item.rarity];
    if (!rarityPrices) {
        console.error(`Unsupported Cosmetic Rarity: Type: ${item.type}, Rarity: ${item.rarity}`);
        return 999;
    }

    const typePrice = rarityPrices[item.type];
    if (!typePrice) {
        console.error(`Unsupported Cosmetic Type: Type: ${item.type}, Rarity: ${item.rarity}`);
        return 999;
    }

    const price = Array.isArray(typePrice)
        ? functions.getRandomElement(typePrice)
        : typePrice;

    return price;
}

async function getCosmetic(type, selectedCosmetics = new Set()) {
    const season = Number(process.env.SEASON);

    const filteredCosmetics = await filterCosmetics(cosmetic =>
        cosmetic.introduction &&
        cosmetic.introduction.backendValue <= season &&
        (type === "featured"
            ? cosmetic.type.value === "outfit"
            : cosmetic.type.value !== "outfit") &&
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

    if (Number(process.env.SEASON) > 15) {
        for (let i = 0; i < 7; i++) {
            const cosmetic = await getCosmetic("daily");
            CatalogConfig.daily.push({
                "itemGrants": [cosmetic.itemGrants],
                "price": cosmetic.price
            });
        }
    } else {
        for (let i = 0; i < 5; i++) {
            const cosmetic = await getCosmetic("daily");
            CatalogConfig.daily.push({
                "itemGrants": [cosmetic.itemGrants],
                "price": cosmetic.price
            });
        }
    }

    if (Number(process.env.SEASON) > 10) {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 3; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic3.price) - 200
            });
        }
    } else {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 2; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic3.price) - 200
            });
        }
    }

    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;

    const daily = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    const weekly = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilSunday, 0, 0, 0));

    global.dailyEnd = daily.toISOString();
    global.weeklyEnd = weekly.toISOString();
}

async function generateDaily() {
    CatalogConfig.daily = [];

    CatalogConfig.daily.push({
        "itemGrants": [process.env.CUSTOM_DAILY_ITEM],
        "price": process.env.CUSTOM_DAILY_ITEM_PRICE
    });

    if (Number(process.env.SEASON) > 15) {
        for (let i = 0; i < 7; i++) {
            const cosmetic = await getCosmetic("daily");
            CatalogConfig.daily.push({
                "itemGrants": [cosmetic.itemGrants],
                "price": cosmetic.price
            });
        }
    } else {
        for (let i = 0; i < 5; i++) {
            const cosmetic = await getCosmetic("daily");
            CatalogConfig.daily.push({
                "itemGrants": [cosmetic.itemGrants],
                "price": cosmetic.price
            });
        }
    }

    const now = new Date();
    const daily = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    global.dailyEnd = daily.toISOString();
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
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic3.price) - 200
            });
        }
    } else {
        CatalogConfig.featured.push({
            "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
            "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
        });

        for (let i = 0; i < 2; i++) {
            const cosmetic = await getCosmetic("featured");
            const cosmetic3 = await getCosmetic("daily");
            CatalogConfig.featured.push({
                "itemGrants": [cosmetic.itemGrants, cosmetic3.itemGrants],
                "price": (cosmetic.price + cosmetic3.price) - 200
            });
        }
    }

    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    const weekly = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilSunday, 0, 0, 0));

    global.weeklyEnd = weekly.toISOString();
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
            const CatalogEntry = { "devName": "", "offerId": "", "fulfillmentIds": [], "dailyLimit": -1, "weeklyLimit": -1, "monthlyLimit": -1, "categories": [], "prices": [{ "currencyType": "MtxCurrency", "currencySubType": "", "regularPrice": 0, "finalPrice": 0, "saleExpiration": "9999-12-02T01:12:00Z", "basePrice": 0 }], "meta": { "NewDisplayAssetPath": "", "SectionId": "Daily", "TileSize": "Small" }, "matchFilter": "", "filterWeight": 0, "appStoreId": [], "requirements": [], "offerType": "StaticPrice", "giftInfo": { "bIsEnabled": true, "forcedGiftBoxTemplateId": "", "purchaseRequirements": [], "giftRecordIds": [] }, "refundable": false, "metaInfo": [{ "key": "SectionId", "value": "Daily" }, { "key": "TileSize", "value": "Small" }], "displayAssetPath": "", "itemGrants": [], "sortPriority": -1, "catalogGroupPriority": 0 };
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

                const cId = item.itemGrants[0].split(":")[1];
                CatalogEntry.displayAssetPath = `/Game/Catalog/DisplayAssets/DA_Featured_${cId.toLowerCase()}.DA_Featured_${cId.toLowerCase()}`;
                CatalogEntry.meta.NewDisplayAssetPath = `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`;
                CatalogEntry.metaInfo.push({
                    "key": "NewDisplayAssetPath",
                    "value": `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`
                })
                const sortPriorityPattern = [-6, -1, -2, -4, -5, -3];
                CatalogEntry.sortPriority = sortPriorityPattern[item.itemGrants.length % sortPriorityPattern.length];

                catalog.storefronts[storefront].catalogEntries.push(CatalogEntry);
            }
        }

        for (let item of featuredItems) {
            const CatalogEntry = { "devName": "", "offerId": "", "fulfillmentIds": [], "dailyLimit": -1, "weeklyLimit": -1, "monthlyLimit": -1, "categories": [], "prices": [{ "currencyType": "MtxCurrency", "currencySubType": "", "regularPrice": 0, "finalPrice": 0, "saleExpiration": "9999-12-02T01:12:00Z", "basePrice": 0 }], "meta": { "NewDisplayAssetPath": "", "SectionId": "Featured", "TileSize": "Small" }, "matchFilter": "", "filterWeight": 0, "appStoreId": [], "requirements": [], "offerType": "StaticPrice", "giftInfo": { "bIsEnabled": true, "forcedGiftBoxTemplateId": "", "purchaseRequirements": [], "giftRecordIds": [] }, "refundable": false, "metaInfo": [{ "key": "SectionId", "value": "Featured" }, { "key": "TileSize", "value": "Small" }], "displayAssetPath": "", "itemGrants": [], "sortPriority": -1, "catalogGroupPriority": 0 };
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

                const cId = item.itemGrants[0].split(":")[1];
                CatalogEntry.displayAssetPath = `/Game/Catalog/DisplayAssets/DA_Featured_${cId.toLowerCase()}.DA_Featured_${cId.toLowerCase()}`;
                CatalogEntry.meta.NewDisplayAssetPath = `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`;
                CatalogEntry.metaInfo.push({
                    "key": "NewDisplayAssetPath",
                    "value": `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`
                })
                const sortPriorityPattern = [-6, -1, -2, -4, -5, -3];
                CatalogEntry.sortPriority = sortPriorityPattern[item.itemGrants.length % sortPriorityPattern.length];

                catalog.storefronts[storefront].catalogEntries.push(CatalogEntry);
            }
        }

        catalog.expiration = global.dailyEnd;
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