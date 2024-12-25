const User = require("../../database/models/user.js");
const crypto = require("crypto");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error.js");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const autoShopConfig = require("../../responses/fortniteConfig/catalog/autoShopConfig.json");
const functions = require("../../utils/functions.js");

const CatalogConfig = {
    "daily": [
        {
            "itemGrants": ["AthenaCharacter:cid_001_athena_commando_f_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_002_athena_commando_f_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_003_athena_commando_f_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_004_athena_commando_f_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_005_athena_commando_m_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_006_athena_commando_m_default"],
            "price": 0
        }
    ],
    "featured": [
        {
            "itemGrants": ["AthenaCharacter:cid_007_athena_commando_m_default"],
            "price": 0
        },
        {
            "itemGrants": ["AthenaCharacter:cid_008_athena_commando_m_default"],
            "price": 0
        }
    ]
};

CatalogConfig.daily = [];
CatalogConfig.featured = [];
for (let i = 0; i < 6; i++) {
    const cosmetic = functions.getRandomElement(autoShopConfig);
    CatalogConfig.daily.push(cosmetic);
}

for (let i = 0; i < 2; i++) {
    const cosmetic = functions.getRandomElement(autoShopConfig);
    CatalogConfig.featured.push(cosmetic);
}

async function catalog(fastify, options) {
    fastify.get('/fortnite/api/storefront/v2/catalog', (request, reply) => {
        const catalog = require("../../responses/fortniteConfig/catalog/catalog.json");

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
        reply.status(200).send(catalog)
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