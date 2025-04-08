const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const cosmetics = require("../responses/fortniteConfig/catalog/br.json");
const functions = require("./functions")

const shop = require("../responses/fortniteConfig/catalog/catalog.json");
const contentpages = require("../responses/fortniteConfig/content/fortnite-game.json");

const CatalogConfig = {
    "daily": [],
    "featured": []
};

let weeklyStorefront = {
    "name": "BRWeeklyStorefront",
    "catalogEntries": []
}

async function filterCosmetics(filter) {
    return cosmetics.data.filter(filter);
}

function setUpShopV2() {
    fs.readdirSync(path.join(__dirname, "..", "responses", "fortniteConfig", "ShopConfigs", "Active")).forEach(fileName => {
        if (fileName.toString().includes("Content")) { } else {
            const filePath = path.join(__dirname, "..", "responses", "fortniteConfig", "ShopConfigs", "Active", fileName);
            const contentPath = path.join(__dirname, "..", "responses", "fortniteConfig", "ShopConfigs", "Active", `${fileName.split(".")[0]}_Content.json`);
            const content = require(contentPath);
            require(filePath).forEach(item => {
                weeklyStorefront.catalogEntries.push(item);
            });

            contentpages.shopSections.sectionList.sections.push(content.shopSections);
            contentpages.mpItemShop.shopData.sections.unshift(content.mpItemShop);

            shop.storefronts.push(weeklyStorefront);
        }
    });
}

function getCatalogEntry(itemGrants, price) {
    const CatalogEntry = {
        "devName": "",
        "offerId": "",
        "fulfillmentIds": [],
        "dailyLimit": -1,
        "weeklyLimit": -1,
        "monthlyLimit": -1,
        "categories": [],
        "prices": [
            {
                "currencyType": "MtxCurrency",
                "currencySubType": "",
                "regularPrice": 0,
                "finalPrice": 0,
                "saleExpiration": "9999-12-02T01:12:00Z",
                "basePrice": 0
            }
        ],
        "meta": {
            "NewDisplayAssetPath": "",
            "SectionId": "DailyItemStore",
            "TileSize": "Normal"
        },
        "matchFilter": "",
        "filterWeight": 0,
        "appStoreId": [],
        "requirements": [],
        "offerType": "StaticPrice",
        "giftInfo": {
            "bIsEnabled": true,
            "forcedGiftBoxTemplateId": "",
            "purchaseRequirements": [],
            "giftRecordIds": []
        },
        "refundable": false,
        "metaInfo": [
            {
                "key": "SectionId",
                "value": "DailyItemStore"
            },
            {
                "key": "LayoutId",
                "value": "DailyItemStore.1"
            },
            {
                "key": "TileSize",
                "value": "Normal"
            }
        ],
        "displayAssetPath": "",
        "itemGrants": [],
        "sortPriority": -1,
        "catalogGroupPriority": 0
    };

    CatalogEntry.meta.TileSize = "Normal";
    CatalogEntry.metaInfo[1].value = "Normal";

    for (let itemGrant of itemGrants) {
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
        "regularPrice": price,
        "finalPrice": price,
        "saleExpiration": "9999-12-02T01:12:00Z",
        "basePrice": price
    }];

    if (CatalogEntry.itemGrants.length > 0) {
        let uniqueIdentifier = crypto.createHash("sha1").update(`${JSON.stringify(itemGrants)}_${price}`).digest("hex");

        CatalogEntry.devName = uniqueIdentifier;
        CatalogEntry.offerId = uniqueIdentifier;

        const cId = itemGrants[0].split(":")[1];
        CatalogEntry.displayAssetPath = `/Game/Catalog/DisplayAssets/DA_Featured_${cId.toLowerCase()}.DA_Featured_${cId.toLowerCase()}`;
        CatalogEntry.meta.NewDisplayAssetPath = `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`;
        CatalogEntry.metaInfo.push({
            "key": "NewDisplayAssetPath",
            "value": `/Game/Catalog/NewDisplayAssets/DAv2_${cId}.DAv2_${cId}`
        })
        const sortPriorityPattern = [-6, -1, -2, -4, -5, -3];
        CatalogEntry.sortPriority = sortPriorityPattern[itemGrants.length % sortPriorityPattern.length];

        console.log(CatalogEntry)
    }
}

function priceGen(item) {
    const rarity = {
        frozen: {
            backpack: 1500,
        },
        slurp: {
            outfit: 2000,
            pickaxe: 1500,
        },
        starwars: {
            outfit: 1500,
            glider: 1000,
            backpack: 800
        },
        dark: {
            outfit: 2000,
            pickaxe: 1500,
            backpack: 800,
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
            glider: 1000
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

    for (let i = 0; i < 7; i++) {
        const cosmetic = await getCosmetic("daily");
        CatalogConfig.daily.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }

    CatalogConfig.featured.push({
        "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
        "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
    });

    for (let i = 0; i < 3; i++) {
        const cosmetic = await getCosmetic("featured");
        CatalogConfig.featured.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
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

    for (let i = 0; i < 7; i++) {
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

    CatalogConfig.featured.push({
        "itemGrants": [process.env.CUSTOM_FEATURED_ITEM],
        "price": process.env.CUSTOM_FEATURED_ITEM_PRICE
    });

    for (let i = 0; i < 3; i++) {
        const cosmetic = await getCosmetic("featured");
        CatalogConfig.featured.push({
            "itemGrants": [cosmetic.itemGrants],
            "price": cosmetic.price
        });
    }

    global.weeklyEnd = new Date(Date.now() + 604800 * 1000).toISOString();
}

function getShop() {
    const catalog = require("../responses/fortniteConfig/catalog/catalog.json");

    let dailystorefrontindex = catalog.storefronts.findIndex(p => p.name == ("BRDailyStorefront"));
    const dailystorefront = catalog.storefronts[dailystorefrontindex];
    dailystorefront.catalogEntries = [];
    weeklyStorefront.catalogEntries = [];

    setUpShopV2();

    const dailyItems = CatalogConfig.daily;
    const featuredItems = CatalogConfig.featured;
    for (let item of featuredItems) {
        const CatalogEntry = {
            "devName": "",
            "offerId": "",
            "fulfillmentIds": [],
            "dailyLimit": -1,
            "weeklyLimit": -1,
            "monthlyLimit": -1,
            "categories": [],
            "prices": [
                {
                    "currencyType": "MtxCurrency",
                    "currencySubType": "",
                    "regularPrice": 0,
                    "finalPrice": 0,
                    "saleExpiration": "9999-12-02T01:12:00Z",
                    "basePrice": 0
                }
            ],
            "meta": {
                "NewDisplayAssetPath": "",
                "SectionId": "DailyItemStore",
                "TileSize": "Normal"
            },
            "matchFilter": "",
            "filterWeight": 0,
            "appStoreId": [],
            "requirements": [],
            "offerType": "StaticPrice",
            "giftInfo": {
                "bIsEnabled": true,
                "forcedGiftBoxTemplateId": "",
                "purchaseRequirements": [],
                "giftRecordIds": []
            },
            "refundable": false,
            "metaInfo": [
                {
                    "key": "SectionId",
                    "value": "DailyItemStore"
                },
                {
                    "key": "LayoutId",
                    "value": "DailyItemStore.1"
                },
                {
                    "key": "TileSize",
                    "value": "Normal"
                }
            ],
            "displayAssetPath": "",
            "itemGrants": [],
            "sortPriority": -1,
            "catalogGroupPriority": 0
        }

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

            weeklyStorefront.catalogEntries.push(CatalogEntry);
        }
    }

    let shouldBeRow3 = false;
    for (let item of dailyItems) {
        const CatalogEntry = {
            "devName": "",
            "offerId": "",
            "fulfillmentIds": [],
            "dailyLimit": -1,
            "weeklyLimit": -1,
            "monthlyLimit": -1,
            "categories": [],
            "prices": [
                {
                    "currencyType": "MtxCurrency",
                    "currencySubType": "",
                    "regularPrice": 0,
                    "finalPrice": 0,
                    "saleExpiration": "9999-12-02T01:12:00Z",
                    "basePrice": 0
                }
            ],
            "meta": {
                "NewDisplayAssetPath": "",
                "SectionId": "DailyItemStore",
                "TileSize": "Small"
            },
            "matchFilter": "",
            "filterWeight": 0,
            "appStoreId": [],
            "requirements": [],
            "offerType": "StaticPrice",
            "giftInfo": {
                "bIsEnabled": true,
                "forcedGiftBoxTemplateId": "",
                "purchaseRequirements": [],
                "giftRecordIds": []
            },
            "refundable": false,
            "metaInfo": [
                {
                    "key": "SectionId",
                    "value": "DailyItemStore"
                },
                {
                    "key": "LayoutId",
                    "value": "DailyItemStore.2"
                },
                {
                    "key": "TileSize",
                    "value": "Small"
                }
            ],
            "displayAssetPath": "",
            "itemGrants": [],
            "sortPriority": -1,
            "catalogGroupPriority": 0
        };

        if (shouldBeRow3) {
            CatalogEntry.metaInfo[1].value = "DailyItemStore.3";
            shouldBeRow3 = false;
        } else {
            shouldBeRow3 = true;
        }

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

            weeklyStorefront.catalogEntries.push(CatalogEntry);
        }
    }

    catalog.storefronts.push(weeklyStorefront);
    return catalog;
}

module.exports = {
    getShop,
    generateCatalog,
    generateDaily,
    generateFeatured,
    setUpShopV2,
    getCatalogEntry
}
