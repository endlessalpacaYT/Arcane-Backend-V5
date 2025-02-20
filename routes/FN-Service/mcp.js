require("dotenv").config();
const fs = require("fs");
const path = require("path");

const Profile = require("../../database/models/profile");

const createError = require("../../utils/error");
const errors = require("../../responses/errors.json");

const functions = require("../../utils/functions");

const { v4: uuidv4 } = require("uuid");

async function mcp(fastify, options) {
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        if (request.query.profileId == "athena") {
            if (profile.stats.attributes.season_num != memory.season) {
                profile.stats.attributes.book_level = 1;
                profile.stats.attributes.book_xp = 0;
                profile.stats.attributes.book_purchased = false;

                profile.stats.attributes.level = 1;
                profile.stats.attributes.accountLevel = 1;

                profile.stats.attributes.xp = 0;
                profile.stats.attributes.xp_overflow = 0;
                profile.stats.attributes.rested_xp = 0;
                profile.stats.attributes.rested_xp_mult = 0;
                profile.stats.attributes.rested_xp_overflow = 0;

                profile.stats.attributes.season_match_boost = 0;
            }
            profile.stats.attributes.season_num = memory.season;

            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            let DateFormat = (new Date().toISOString()).split("T")[0];
            let ShouldGiveQuest = false;
            if (profile.stats.attributes.quest_manager) {
                if (profile.stats.attributes.quest_manager.hasOwnProperty("dailyLoginInterval")) {
                    if (profile.stats.attributes.quest_manager.dailyLoginInterval.includes("T")) {
                        let DailyLoginDate = profile.stats.attributes.quest_manager.dailyLoginInterval.split("T")[0];

                        if (DailyLoginDate === DateFormat) {
                            ShouldGiveQuest = false;
                        } else {
                            ShouldGiveQuest = true;
                        }
                    }
                } else {
                    profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();
                }
            }

            if (ShouldGiveQuest) {
                for (let key in profile.items) {
                    if (key.startsWith("Quest:")) {
                        delete profile.items[key];
                    }
                }
            }

            let season = process.env.season;

            if (season.length == 1) {
                season = `0${process.env.season}`
            }

            for (let key in profile.items) {
                if (!key.startsWith(`QS${season}`) && key.startsWith(`QS`)) {
                    delete profile.items[key];
                } else if (!key.startsWith(`SeasonalQuest${season}`) && key.startsWith(`SeasonalQuest`)) {
                    delete profile.items[key];
                } else if (!key.startsWith(`seasonalquest${season}`) && key.startsWith(`seasonalquest`)) {
                    delete profile.items[key];
                }
            }

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (profile.rvn == profile.commandRevision) {
            profile.rvn += 1;

            if (request.query.profileId == "athena") {
                if (!profile.stats.attributes.last_applied_loadout) profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
            }

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        /*if ((request.query.profileId == "common_core")) {
            let athena = profiles.profiles["athena"];
            MultiUpdate = [{
                "profileRevision": athena.rvn || 0,
                "profileId": "athena",
                "profileChangesBaseRevision": athena.rvn || 0,
                "profileChanges": [{
                    "changeType": "fullProfileUpdate",
                    "profile": athena
                }],
                "profileCommandRevision": athena.commandRevision || 0,
            }];
        }*/

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlot', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let templateId = profile.items[request.body.itemToSlot] ? profile.items[request.body.itemToSlot].templateId : request.body.itemToSlot;

        if (request.body.category == "Dance") {
            profile.stats.attributes.favorite_dance[request.body.slotIndex] = request.body.itemToSlot;
            profile.items[request.body.lockerItem].attributes.locker_slots_data.slots.Dance.items[request.body.slotIndex] = templateId;

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "favorite_dance",
                "value": profile.stats.attributes["favorite_dance"]
            });
        } else if (request.body.category == "ItemWrap") {
            profile.stats.attributes.favorite_itemwraps[request.body.slotIndex] = request.body.itemToSlot;
            profile.items[request.body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[request.body.slotIndex] = templateId;

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "favorite_itemwraps",
                "value": profile.stats.attributes["favorite_itemwraps"]
            });
        } else {
            profile.stats.attributes[(`favorite_${request.body.category}`).toLowerCase()] = request.body.itemToSlot;
            profile.items[request.body.lockerItem].attributes.locker_slots_data.slots[request.body.category].items = [templateId];

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": (`favorite_${request.body.category}`).toLowerCase(),
                "value": profile.stats.attributes[(`favorite_${request.body.category}`).toLowerCase()]
            });
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": request.body.lockerItem,
                "attributeName": "locker_slots_data",
                "attributeValue": profile.items[request.body.lockerItem].attributes.locker_slots_data
            })

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlots', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        for (let item of request.body.loadoutData) {
            let templateId = profile.items[item.itemToSlot] ? profile.items[item.itemToSlot].templateId : item.itemToSlot;

            if (item.category == "Dance") {
                profile.stats.attributes.favorite_dance[item.slotIndex] = item.itemToSlot;
                profile.items[request.body.lockerItem].attributes.locker_slots_data.slots.Dance.items[item.slotIndex] = templateId;

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": "favorite_dance",
                    "value": profile.stats.attributes["favorite_dance"]
                });
            } else if (item.category == "ItemWrap") {
                profile.stats.attributes.favorite_itemwraps[item.slotIndex] = item.itemToSlot;
                profile.items[request.body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[item.slotIndex] = templateId;

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": "favorite_itemwraps",
                    "value": profile.stats.attributes["favorite_itemwraps"]
                });
            } else {
                profile.stats.attributes[(`favorite_${item.category}`).toLowerCase()] = item.itemToSlot;
                profile.items[request.body.lockerItem].attributes.locker_slots_data.slots[item.category].items = [templateId];

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": (`favorite_${item.category}`).toLowerCase(),
                    "value": profile.stats.attributes[(`favorite_${item.category}`).toLowerCase()]
                });
            }
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": request.body.lockerItem,
                "attributeName": "locker_slots_data",
                "attributeValue": profile.items[request.body.lockerItem].attributes.locker_slots_data
            })

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        profile.stats.attributes.banner_icon = request.body.bannerIconTemplateName;
        profile.stats.attributes.banner_color = request.body.bannerColorTemplateName;

        profile.items[request.body.lockerItem].attributes.banner_icon_template = request.body.bannerIconTemplateName;
        profile.items[request.body.lockerItem].attributes.banner_color_template = request.body.bannerColorTemplateName;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": request.body.lockerItem,
            "attributeName": "banner_icon_template",
            "attributeValue": profile.items[request.body.lockerItem].attributes.banner_icon_template
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": request.body.lockerItem,
            "attributeName": "banner_color_template",
            "attributeValue": profile.items[request.body.lockerItem].attributes.banner_color_template
        })

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/BulkEquipBattleRoyaleCustomization', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
        for (let item of request.body.loadoutData) {
            let templateId = profile.items[item.itemToSlot] ? profile.items[item.itemToSlot].templateId : item.itemToSlot;

            if (item.slotName == "Dance") {
                // idek why this isnt working
                profile.stats.attributes.favorite_dance[item.indexWithinSlot] = item.itemToSlot;
                profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[item.indexWithinSlot] = templateId;

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": "favorite_dance",
                    "value": profile.stats.attributes["favorite_dance"]
                });
            } else if (item.slotName == "ItemWrap") {
                // i have no way to test this with my current profiles so i wont be doing this for now
            } else {
                profile.stats.attributes[(`favorite_${item.slotName}`).toLowerCase()] = item.itemToSlot;
                profile.items[activeLoadout].attributes.locker_slots_data.slots[item.slotName].items = [templateId];

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": (`favorite_${item.slotName}`).toLowerCase(),
                    "value": profile.stats.attributes[(`favorite_${item.slotName}`).toLowerCase()]
                });
            }
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/EquipBattleRoyaleCustomization', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
        let templateId = profile.items[request.body.itemToSlot] ? profile.items[request.body.itemToSlot].templateId : request.body.itemToSlot;

        if (request.body.slotName == "Dance") {
            profile.stats.attributes.favorite_dance[request.body.indexWithinSlot] = request.body.itemToSlot;
            profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[request.body.indexWithinSlot] = templateId;

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "favorite_dance",
                "value": profile.stats.attributes["favorite_dance"]
            });
        } else if (request.body.slotName == "ItemWrap") {
            // i have no way to test this with my current profiles so i wont be doing this for now
        } else {
            profile.stats.attributes[(`favorite_${request.body.slotName}`).toLowerCase()] = request.body.itemToSlot;
            profile.items[activeLoadout].attributes.locker_slots_data.slots[request.body.slotName].items = [templateId];

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": (`favorite_${request.body.slotName}`).toLowerCase(),
                "value": profile.stats.attributes[(`favorite_${request.body.slotName}`).toLowerCase()]
            });
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetBattleRoyaleBanner', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];

        profile.stats.attributes.banner_icon = request.body.homebaseBannerIconId;
        profile.stats.attributes.banner_color = request.body.homebaseBannerColorId;

        profile.items[activeLoadout].attributes.banner_icon_template = request.body.homebaseBannerIconId;
        profile.items[activeLoadout].attributes.banner_color_template = request.body.homebaseBannerColorId;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "banner_icon",
            "value": profile.items[activeLoadout].attributes.banner_icon_template
        });

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "banner_color",
            "value": profile.items[activeLoadout].attributes.banner_color_template
        });

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        let athena = profiles.profiles["athena"];
        let profile0 = profiles.profiles["profile0"];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [{
            "profileRevision": athena.rvn || 0,
            "profileId": "athena",
            "profileChangesBaseRevision": athena.rvn || 0,
            "profileChanges": [],
            "profileCommandRevision": athena.commandRevision || 0,
        }];
        let Notifications = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;
        let findOfferId = functions.getOfferID(request.body.offerId);
        let offerId = request.body.offerId;
        let ItemExists = false;

        if (fs.existsSync(`./responses/fortniteConfig/Athena/Battlepasses/Season${memory.season}.json`)) {
            let BattlePass = require(`../../responses/fortniteConfig/Athena/Battlepasses/Season${memory.season}.json`);

            if (request.body.offerId == BattlePass.battlePassOfferId || request.body.offerId == BattlePass.battleBundleOfferId || request.body.offerId == BattlePass.tierOfferId) {
                let offerId = request.body.offerId;
                let purchaseQuantity = request.body.purchaseQuantity || 1;
                let totalPrice = findOfferId.offerId.prices[0].finalPrice * purchaseQuantity;

                if (request.body.offerId == BattlePass.battlePassOfferId || request.body.offerId == BattlePass.battleBundleOfferId || request.body.offerId == BattlePass.tierOfferId) {
                    if (findOfferId.offerId.prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                        let paid = false;
                        for (let key in profile.items) {
                            if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;
                            let currencyPlatform = profile.items[key].attributes.platform;
                            if ((currencyPlatform.toLowerCase() != profile.stats.attributes.current_mtx_platform.toLowerCase()) && (currencyPlatform.toLowerCase() != "shared")) continue;
                            if (profile.items[key].quantity < totalPrice) {
                                return reply.status(400).send();
                            }

                            profile.items[key].quantity -= totalPrice;
                            profile0.items[key].quantity -= totalPrice;
                            ApplyProfileChanges.push(
                                {
                                    "changeType": "itemQuantityChanged",
                                    "itemId": key,
                                    "quantity": profile.items[key].quantity
                                },
                                {
                                    "changeType": "itemQuantityChanged",
                                    "itemId": key,
                                    "quantity": profile0.items[key].quantity
                                }
                            );
                            paid = true;
                            break;
                        }
                        if (!paid && totalPrice > 0) {
                            return reply.status(400).send();
                        }
                    }
                }

                if (BattlePass.battlePassOfferId == offerId || BattlePass.battleBundleOfferId == offerId) {
                    var lootList = [];
                    var EndingTier = athena.stats.attributes.book_level;
                    athena.stats.attributes.book_purchased = true;

                    const tokenKey = `Token:Athena_S${memory.season}_NoBattleBundleOption_Token`;
                    const tokenData = {
                        "templateId": `Token:athena_s${memory.season}_nobattlebundleoption_token`,
                        "attributes": {
                            "max_level_bonus": 0,
                            "level": 1,
                            "item_seen": true,
                            "xp": 0,
                            "favorite": false
                        },
                        "quantity": 1
                    };

                    profiles.profiles["common_core"].items[tokenKey] = tokenData;

                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": tokenKey,
                        "item": tokenData
                    });

                    if (BattlePass.battleBundleOfferId == offerId) {
                        athena.stats.attributes.book_level += 25;
                        if (athena.stats.attributes.book_level > 100)
                            athena.stats.attributes.book_level = 100;
                        EndingTier = athena.stats.attributes.book_level;
                    }
                    for (var i = 0; i < EndingTier; i++) {
                        var FreeTier = BattlePass.freeRewards[i] || {};
                        var PaidTier = BattlePass.paidRewards[i] || {};
                        for (var item in FreeTier) {
                            if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                athena.stats.attributes.season_match_boost += FreeTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_match_boost",
                                    "value": athena.stats.attributes.season_match_boost
                                });
                            }
                            if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                athena.stats.attributes.season_friend_match_boost += FreeTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_friend_match_boost",
                                    "value": athena.stats.attributes.season_friend_match_boost
                                });
                            }
                            if (item.toLowerCase().startsWith("currency:mtx")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                        if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                            profile.items[key].attributes.quantity += FreeTier[item];
                                            break;
                                        }
                                    }
                                }
                            }
                            if (item.toLowerCase().startsWith("homebasebanner")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        profile.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        ApplyProfileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": profile.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    var Item = { "templateId": item, "attributes": { "item_seen": false }, "quantity": 1 };
                                    profile.items[ItemID] = Item;
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            if (item.toLowerCase().startsWith("athena")) {
                                for (var key in athena.items) {
                                    if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        athena.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        MultiUpdate[0].profileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": athena.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    const Item = { "templateId": item, "attributes": { "max_level_bonus": 0, "level": 1, "item_seen": false, "xp": 0, "variants": [], "favorite": false }, "quantity": FreeTier[item] };
                                    athena.items[ItemID] = Item;
                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            lootList.push({
                                "itemType": item,
                                "itemGuid": item,
                                "quantity": FreeTier[item]
                            });
                        }
                        for (var item in PaidTier) {
                            if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                athena.stats.attributes.season_match_boost += PaidTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_match_boost",
                                    "value": athena.stats.attributes.season_match_boost
                                });
                            }
                            if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                athena.stats.attributes.season_friend_match_boost += PaidTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_friend_match_boost",
                                    "value": athena.stats.attributes.season_friend_match_boost
                                });
                            }
                            if (item.toLowerCase().startsWith("currency:mtx")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                        if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                            profile.items[key].quantity += PaidTier[item];
                                            profile0.items[key].quantity += PaidTier[item];
                                            break;
                                        }
                                    }
                                }
                            }
                            if (item.toLowerCase().startsWith("homebasebanner")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        profile.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        ApplyProfileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": profile.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    var Item = { "templateId": item, "attributes": { "item_seen": false }, "quantity": 1 };
                                    profile.items[ItemID] = Item;
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            if (item.toLowerCase().startsWith("athena")) {
                                for (var key in athena.items) {
                                    if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        athena.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        MultiUpdate[0].profileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": athena.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    const Item = { "templateId": item, "attributes": { "max_level_bonus": 0, "level": 1, "item_seen": false, "xp": 0, "variants": [], "favorite": false }, "quantity": PaidTier[item] };
                                    athena.items[ItemID] = Item;
                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            lootList.push({
                                "itemType": item,
                                "itemGuid": item,
                                "quantity": PaidTier[item]
                            });
                        }
                    }
                    var GiftBoxID = uuidv4();
                    var GiftBox = { "templateId": 8 <= 4 ? "GiftBox:gb_battlepass" : "GiftBox:gb_battlepasspurchased", "attributes": { "max_level_bonus": 0, "fromAccountId": "", "lootList": lootList } };
                    if (8 > 2) {
                        profile.items[GiftBoxID] = GiftBox;
                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": GiftBoxID,
                            "item": GiftBox
                        });
                    }
                    MultiUpdate[0].profileChanges.push({
                        "changeType": "statModified",
                        "name": "book_purchased",
                        "value": athena.stats.attributes.book_purchased
                    });
                    MultiUpdate[0].profileChanges.push({
                        "changeType": "statModified",
                        "name": "book_level",
                        "value": athena.stats.attributes.book_level
                    });
                }

                if (BattlePass.tierOfferId == offerId) {
                    var lootList = [];
                    var StartingTier = athena.stats.attributes.book_level;
                    var EndingTier;
                    athena.stats.attributes.book_level += request.body.purchaseQuantity || 1;
                    EndingTier = athena.stats.attributes.book_level;
                    for (let i = StartingTier; i < EndingTier; i++) {
                        var FreeTier = BattlePass.freeRewards[i] || {};
                        var PaidTier = BattlePass.paidRewards[i] || {};
                        for (var item in FreeTier) {
                            if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                athena.stats.attributes.season_match_boost += FreeTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_match_boost",
                                    "value": athena.stats.attributes.season_match_boost
                                });
                            }
                            if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                athena.stats.attributes.season_friend_match_boost += FreeTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_friend_match_boost",
                                    "value": athena.stats.attributes.season_friend_match_boost
                                });
                            }
                            if (item.toLowerCase().startsWith("currency:mtx")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                        if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                            profile.items[key].quantity += FreeTier[item];
                                            profile0.items[key].quantity += PaidTier[item];
                                            break;
                                        }
                                    }
                                }
                            }
                            if (item.toLowerCase().startsWith("homebasebanner")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        profile.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        ApplyProfileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": profile.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    var Item = { "templateId": item, "attributes": { "item_seen": false }, "quantity": 1 };
                                    profile.items[ItemID] = Item;
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            if (item.toLowerCase().startsWith("athena")) {
                                for (var key in athena.items) {
                                    if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        athena.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        MultiUpdate[0].profileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": athena.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    const Item = { "templateId": item, "attributes": { "max_level_bonus": 0, "level": 1, "item_seen": false, "xp": 0, "variants": [], "favorite": false }, "quantity": FreeTier[item] };
                                    athena.items[ItemID] = Item;
                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            lootList.push({
                                "itemType": item,
                                "itemGuid": item,
                                "quantity": FreeTier[item]
                            });
                        }
                        for (var item in PaidTier) {
                            if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                athena.stats.attributes.season_match_boost += PaidTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_match_boost",
                                    "value": athena.stats.attributes.season_match_boost
                                });
                            }
                            if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                athena.stats.attributes.season_friend_match_boost += PaidTier[item];
                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "season_friend_match_boost",
                                    "value": athena.stats.attributes.season_friend_match_boost
                                });
                            }
                            if (item.toLowerCase().startsWith("currency:mtx")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                        if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                            profile.items[key].quantity += PaidTier[item];
                                            profile0.items[key].quantity += PaidTier[item];
                                            break;
                                        }
                                    }
                                }
                            }
                            if (item.toLowerCase().startsWith("homebasebanner")) {
                                for (var key in profile.items) {
                                    if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        profile.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        ApplyProfileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": profile.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    var Item = { "templateId": item, "attributes": { "item_seen": false }, "quantity": 1 };
                                    profile.items[ItemID] = Item;
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            if (item.toLowerCase().startsWith("athena")) {
                                for (var key in athena.items) {
                                    if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                        athena.items[key].attributes.item_seen = false;
                                        ItemExists = true;
                                        MultiUpdate[0].profileChanges.push({
                                            "changeType": "itemAttrChanged",
                                            "itemId": key,
                                            "attributeName": "item_seen",
                                            "attributeValue": athena.items[key].attributes.item_seen
                                        });
                                    }
                                }
                                if (ItemExists == false) {
                                    var ItemID = uuidv4();
                                    const Item = { "templateId": item, "attributes": { "max_level_bonus": 0, "level": 1, "item_seen": false, "xp": 0, "variants": [], "favorite": false }, "quantity": PaidTier[item] };
                                    athena.items[ItemID] = Item;
                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ItemID,
                                        "item": Item
                                    });
                                }
                                ItemExists = false;
                            }
                            lootList.push({
                                "itemType": item,
                                "itemGuid": item,
                                "quantity": PaidTier[item]
                            });
                        }
                    }
                    var GiftBoxID = uuidv4();
                    var GiftBox = {
                        "templateId": "GiftBox:gb_battlepass",
                        "attributes": {
                            "max_level_bonus": 0,
                            "fromAccountId": "",
                            "lootList": lootList
                        }
                    };
                    if (8 > 2) {
                        profile.items[GiftBoxID] = GiftBox;
                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": GiftBoxID,
                            "item": GiftBox
                        });
                    }
                    MultiUpdate[0].profileChanges.push({
                        "changeType": "statModified",
                        "name": "book_level",
                        "value": athena.stats.attributes.book_level
                    });
                }

                if (MultiUpdate[0].profileChanges.length > 0) {
                    athena.rvn += 1;
                    athena.commandRevision += 1;
                    athena.updated = new Date().toISOString();
                    MultiUpdate[0].profileRevision = athena.rvn;
                    MultiUpdate[0].profileCommandRevision = athena.commandRevision;
                }

                if (ApplyProfileChanges.length > 0) {
                    profile.rvn += 1;
                    profile.commandRevision += 1;
                    profile.updated = new Date().toISOString();
                    await profiles?.updateOne({
                        $set: {
                            [`profiles.${request.query.profileId}`]: profile,
                            [`profiles.athena`]: athena,
                            [`profiles.profile0`]: profile0
                        }
                    });
                }

                if (QueryRevision != ProfileRevisionCheck) {
                    ApplyProfileChanges = [{
                        "changeType": "fullProfileUpdate",
                        "profile": profile
                    }];
                }

                if (ApplyProfileChanges.length > 0) {
                    await profiles?.updateOne({
                        $set: {
                            [`profiles.${request.query.profileId}`]: profile,
                            [`profiles.athena`]: athena,
                            [`profiles.profile0`]: profile0
                        }
                    });
                }

                return reply.status(200).send({
                    profileRevision: profile.rvn || 0,
                    profileId: request.query.profileId,
                    profileChangesBaseRevision: BaseRevision,
                    profileChanges: ApplyProfileChanges,
                    notifications: Notifications,
                    profileCommandRevision: profile.commandRevision || 0,
                    serverTime: new Date().toISOString(),
                    multiUpdate: MultiUpdate,
                    responseVersion: 1
                });
            }
        }

        switch (true) {
            case /^BR(Daily|Weekly|Season)Storefront$/.test(findOfferId.name):
                Notifications.push({
                    "type": "CatalogPurchase",
                    "primary": true,
                    "lootResult": {
                        "items": []
                    }
                });

                for (let value of findOfferId.offerId.itemGrants) {
                    const ID = value.templateId;
                    const Item = {
                        "templateId": value.templateId,
                        "attributes": {
                            "item_seen": false,
                            "variants": [],
                        },
                        "quantity": 1
                    };

                    athena.items[ID] = Item;

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": athena.items[ID]
                    });

                    Notifications[0].lootResult.items.push({
                        "itemType": Item.templateId,
                        "itemGuid": ID,
                        "itemProfile": "athena",
                        "quantity": 1
                    });
                }

                if (findOfferId.offerId.prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                    let paid = false;

                    for (let key in profile.items) {
                        if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;

                        let currencyPlatform = profile.items[key].attributes.platform;
                        if ((currencyPlatform.toLowerCase() != profile.stats.attributes.current_mtx_platform.toLowerCase()) && (currencyPlatform.toLowerCase() != "shared")) continue;

                        if (profile.items[key].quantity < findOfferId.offerId.prices[0].finalPrice) return reply.status(400).send();

                        profile.items[key].quantity -= findOfferId.offerId.prices[0].finalPrice;

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": key,
                            "quantity": profile.items[key].quantity
                        });

                        paid = true;

                        break;
                    }
                }

                if (MultiUpdate[0].profileChanges.length > 0) {
                    athena.rvn += 1;
                    athena.commandRevision += 1;
                    athena.updated = new Date().toISOString();

                    MultiUpdate[0].profileRevision = athena.rvn;
                    MultiUpdate[0].profileCommandRevision = athena.commandRevision;
                }
                break;
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile, [`profiles.athena`]: athena } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            notifications: Notifications,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post("/fortnite/api/game/v2/profile/:accountId/client/RemoveGiftBox", async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });

        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (typeof request.body.giftBoxItemId == "string") {
            delete profile.items[request.body.giftBoxItemId];

            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": request.body.giftBoxItemId
            });
        }

        if (Array.isArray(request.body.giftBoxItemIds)) {
            for (let giftBoxItemId of request.body.giftBoxItemIds) {
                delete profile.items[giftBoxItemId];

                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": giftBoxItemId
                });
            }
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    });

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/IncrementNamedCounterStat', async (request, reply) => {
        const { counterName } = request.body;

        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;
        profile.stats.attributes.named_counters[counterName].current_count = profile.stats.attributes.named_counters[counterName].current_count + 1;
        profile.stats.attributes.named_counters[counterName].last_incremented_time = new Date().toISOString();

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "current_count",
            "value": profile.stats.attributes.named_counters[counterName].current_count
        });

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "last_incremented_time",
            "value": profile.stats.attributes.named_counters[counterName].last_incremented_time
        });

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/MarkItemSeen', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        for (let i in request.body.itemIds) {
            if (!profile.items[request.body.itemIds[i]]) continue;

            profile.items[request.body.itemIds[i]].attributes.item_seen = true;

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": request.body.itemIds[i],
                "attributeName": "item_seen",
                "attributeValue": true
            });
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        let AthenaQuestIDS = require("../../responses/fortniteConfig/Athena/quests.json");
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let QuestCount = 0;
        let ShouldGiveQuest = true;
        let DateFormat = (new Date().toISOString()).split("T")[0];
        let DailyQuestIDS;
        let SeasonQuestIDS;
        const SeasonPrefix = memory.season < 10 ? `0${memory.season}` : memory.season;

        try {
            if (request.query.profileId == "athena") {
                if (memory.season == 12) {
                    const season12Dailies = require("../../responses/fortniteConfig/Athena/QuestsV2/Season12.json");
                    DailyQuestIDS = season12Dailies.Daily;
                } else {
                    DailyQuestIDS = AthenaQuestIDS.Daily;
                }

                if (AthenaQuestIDS.hasOwnProperty(`Season${SeasonPrefix}`)) {
                    SeasonQuestIDS = AthenaQuestIDS[`Season${SeasonPrefix}`]
                }

                for (let key in profile.items) {
                    if (profile.items[key].templateId.toLowerCase().startsWith("quest:athenadaily")) {
                        QuestCount += 1;
                    }
                }
            } else {
                DailyQuestIDS = [];
            }

            if (!profile.stats.attributes.quest_manager) {
                profile.stats.attributes.quest_manager = {};
            }

            if (profile.stats.attributes.quest_manager.hasOwnProperty("dailyLoginInterval")) {
                if (profile.stats.attributes.quest_manager.dailyLoginInterval.includes("T")) {
                    let DailyLoginDate = profile.stats.attributes.quest_manager.dailyLoginInterval.split("T")[0];

                    if (DailyLoginDate === DateFormat) {
                        ShouldGiveQuest = false;
                    } else {
                        ShouldGiveQuest = true;
                        if (!profile.stats.attributes.quest_manager.dailyQuestRerolls) {
                            profile.stats.attributes.quest_manager.dailyQuestRerolls = 1;
                        } else if (profile.stats.attributes.quest_manager.dailyQuestRerolls <= 0) {
                            profile.stats.attributes.quest_manager.dailyQuestRerolls += 1;
                        }
                    }
                }
            } else {
                profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();
            }

            if (request.query.profileId == "athena") {
                if (QuestCount < 3 && ShouldGiveQuest == true) {
                    for (let i = 0; i < 3; i++) {
                        let randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

                        for (let key in profile.items) {
                            while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
                                randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
                            }
                        }
                        const NewQuestID = `Quest:${uuidv4()}`;

                        profile.items[NewQuestID] = {
                            "templateId": DailyQuestIDS[randomNumber].templateId,
                            "attributes": {
                                "creation_time": new Date().toISOString(),
                                "level": -1,
                                "item_seen": false,
                                "sent_new_notification": false,
                                "xp_reward_scalar": 1,
                                "quest_state": "Active",
                                "last_state_change_time": new Date().toISOString(),
                                "max_level_bonus": 0,
                                "xp": 500,
                                "favorite": false
                            },
                            "quantity": 1
                        };

                        for (let i in DailyQuestIDS[randomNumber].objectives) {
                            profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0
                        }

                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": NewQuestID,
                            "item": profile.items[NewQuestID]
                        })
                    }
                    profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();

                    ApplyProfileChanges.push({
                        "changeType": "statModified",
                        "name": "quest_manager",
                        "value": profile.stats.attributes.quest_manager
                    })
                }
            }
        } catch (err) {
            console.error(err);
        }

        let season = process.env.season;

        if (season.length == 1) {
            season = `0${process.env.season}`
        }

        if (SeasonQuestIDS) {
            let QuestsToAdd = [];

            if (request.query.profileId == "athena") {
                for (let ChallengeBundleScheduleID in SeasonQuestIDS.ChallengeBundleSchedules) {
                    let ChallengeBundleSchedule = SeasonQuestIDS.ChallengeBundleSchedules[ChallengeBundleScheduleID];

                    profile.items[ChallengeBundleScheduleID] = {
                        "templateId": ChallengeBundleSchedule.templateId,
                        "attributes": {
                            "unlock_epoch": new Date().toISOString(),
                            "max_level_bonus": 0,
                            "level": 1,
                            "item_seen": true,
                            "xp": 0,
                            "favorite": false,
                            "granted_bundles": ChallengeBundleSchedule.granted_bundles
                        },
                        "quantity": 1
                    }

                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ChallengeBundleScheduleID,
                        "item": profile.items[ChallengeBundleScheduleID]
                    })
                }

                for (let ChallengeBundleID in SeasonQuestIDS.ChallengeBundles) {
                    let ChallengeBundle = SeasonQuestIDS.ChallengeBundles[ChallengeBundleID];

                    profile.items[ChallengeBundleID] = {
                        "templateId": ChallengeBundle.templateId,
                        "attributes": {
                            "has_unlock_by_completion": false,
                            "num_quests_completed": 0,
                            "level": 0,
                            "grantedquestinstanceids": ChallengeBundle.grantedquestinstanceids,
                            "item_seen": true,
                            "max_allowed_bundle_level": 0,
                            "num_granted_bundle_quests": 0,
                            "max_level_bonus": 0,
                            "challenge_bundle_schedule_id": ChallengeBundle.challenge_bundle_schedule_id,
                            "num_progress_quests_completed": 0,
                            "xp": 0,
                            "favorite": false
                        },
                        "quantity": 1
                    }

                    QuestsToAdd = QuestsToAdd.concat(ChallengeBundle.grantedquestinstanceids);
                    profile.items[ChallengeBundleID].attributes.num_granted_bundle_quests = ChallengeBundle.grantedquestinstanceids.length;

                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ChallengeBundleID,
                        "item": profile.items[ChallengeBundleID]
                    })
                }
            } else {
                for (let key in SeasonQuestIDS.Quests) {
                    QuestsToAdd.push(key)
                }
            }

            function ParseQuest(QuestID) {
                var Quest = SeasonQuestIDS.Quests[QuestID];
                const challengeId = `SeasonalQuest${season}:${QuestID}`.toLowerCase();

                profile.items[challengeId] = {
                    "templateId": Quest.templateId,
                    "attributes": {
                        "creation_time": new Date().toISOString(),
                        "level": -1,
                        "item_seen": true,
                        "sent_new_notification": true,
                        "challenge_bundle_id": Quest.challenge_bundle_id || "",
                        "xp_reward_scalar": 1,
                        "quest_state": "Active",
                        "last_state_change_time": new Date().toISOString(),
                        "max_level_bonus": 0,
                        "xp": 0,
                        "favorite": false
                    },
                    "quantity": 1
                }

                for (var i in Quest.objectives) {
                    profile.items[challengeId].attributes[`completion_${i}`] = 0;
                }

                ApplyProfileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": QuestID,
                    "item": profile.items[challengeId]
                })
            }

            for (var Quest in QuestsToAdd) {
                ParseQuest(QuestsToAdd[Quest])
            }
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/UpdateQuestClientObjectives', async (request, reply) => {
        const { advance } = request.body;
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let Notifications = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        let season = process.env.season;

        if (season.length == 1) {
            season = `0${process.env.season}`
        }

        advance.forEach(quest => {
            try {
                const questIndex = `SeasonalQuest${season}:QS${season}-${quest.statName}`.toLowerCase();
                let completionKey = null;
                for (const [key, value] of Object.entries(profile.items[questIndex].attributes)) {
                    if (key.startsWith("completion")) {
                        completionKey = key;
                        break;
                    }
                }
                profile.items[questIndex].attributes[completionKey] += advance.count;
                profile.items[questIndex].attributes.quest_state = "Completed";

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "itemId": questIndex,
                    "item": profile.items[questIndex].attributes[completionKey]
                })

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": questIndex,
                    "attributeName": questIndex,
                    "attributeValue": profile.items[questIndex].attributes[completionKey]
                })
            } catch (err) {
                return createError.createError({
                    "errorCode": "errors.com.epicgames.quest.notfound",
                    "errorMessage": "Bro stop trying to claim the quests using this mcp route, its broken duh!",
                    "messageVars": ["quests"],
                    "numericErrorCode": 4522,
                    "originatingService": "com.epicgames.mcp.UpdateQuestClientObjectives",
                    "intent": "prod",
                    "error_description": "Bro stop trying to claim the quests using this mcp route, its broken duh!",
                    "error": "BAD_REQUEST!"
                }, 400, reply);
            }
        })

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != BaseRevision) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            "profileRevision": profile.rvn || 0,
            "profileId": request.query.profileId || "campaign",
            "profileChangesBaseRevision": BaseRevision,
            "profileChanges": ApplyProfileChanges,
            "notifications": Notifications,
            "profileCommandRevision": profile.commandRevision || 0,
            "serverTime": new Date().toISOString(),
            "multiUpdate": MultiUpdate,
            "responseVersion": 1
        })
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/FortRerollDailyQuest', async (request, reply) => {
        const { questId } = request.body;
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);
        const AthenaQuestIDS = require("../../responses/fortniteConfig/Athena/quests.json");

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let Notifications = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;
        const SeasonPrefix = memory.season < 10 ? `0${memory.season}` : memory.season;

        if (profile.stats.attributes.quest_manager.dailyQuestRerolls == 0) {
            return reply.status(400).send();
        }

        if (request.query.profileId == "athena") {
            if (memory.season == 12) {
                const season12Dailies = require("../../responses/fortniteConfig/Athena/QuestsV2/Season12.json");
                DailyQuestIDS = season12Dailies.Daily;
            } else {
                DailyQuestIDS = AthenaQuestIDS.Daily;
            }

            if (AthenaQuestIDS.hasOwnProperty(`Season${SeasonPrefix}`)) {
                SeasonQuestIDS = AthenaQuestIDS[`Season${SeasonPrefix}`]
            }
        } else {
            DailyQuestIDS = [];
        }

        for (let key in profile.items) {
            if (key.includes(questId)) {
                delete profile.items[key];
                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": questId
                })
            }
        }

        let randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

        for (let key in profile.items) {
            while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
                randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
            }
        }
        const NewQuestID = `Quest:${uuidv4()}`;

        profile.items[NewQuestID] = {
            "templateId": DailyQuestIDS[randomNumber].templateId,
            "attributes": {
                "creation_time": new Date().toISOString(),
                "level": -1,
                "item_seen": false,
                "sent_new_notification": false,
                "xp_reward_scalar": 1,
                "quest_state": "Active",
                "last_state_change_time": new Date().toISOString(),
                "max_level_bonus": 0,
                "xp": 500,
                "favorite": false
            },
            "quantity": 1
        };

        for (let i in DailyQuestIDS[randomNumber].objectives) {
            profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0
        }

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": NewQuestID,
            "item": profile.items[NewQuestID]
        })

        profile.stats.attributes.quest_manager.dailyQuestRerolls = 0;
        ApplyProfileChanges.push({
            "changeType": "statModified",
            "itemId": "dailyQuestRerolls",
            "item": profile.stats.attributes.quest_manager.dailyQuestRerolls
        })

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != BaseRevision) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            "profileRevision": profile.rvn || 0,
            "profileId": request.query.profileId || "campaign",
            "profileChangesBaseRevision": BaseRevision,
            "profileChanges": ApplyProfileChanges,
            "notifications": Notifications,
            "profileCommandRevision": profile.commandRevision || 0,
            "serverTime": new Date().toISOString(),
            "multiUpdate": MultiUpdate,
            "responseVersion": 1
        })
    })

    // TODO: Redo this pile of trash
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimQuestReward', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let Notifications = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != BaseRevision) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            "profileRevision": profile.rvn || 0,
            "profileId": request.query.profileId || "campaign",
            "profileChangesBaseRevision": BaseRevision,
            "profileChanges": ApplyProfileChanges,
            "notifications": Notifications,
            "profileCommandRevision": profile.commandRevision || 0,
            "serverTime": new Date().toISOString(),
            "multiUpdate": MultiUpdate,
            "responseVersion": 1
        })
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/MarkNewQuestNotificationSent', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (request.body.itemIds) {
            for (let i in request.body.itemIds) {
                let id = request.body.itemIds[i];

                profile.items[id].attributes.sent_new_notification = true

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": id,
                    "attributeName": "sent_new_notification",
                    "attributeValue": true
                })
            }

            StatChanged = true;
        }

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how i will do this
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/GetMcpTimeForLogin', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how to do this
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetHardcoreModifier', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how to do this
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/RefreshExpeditions', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how to do this
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/CreateOrUpgradeOutpostItem', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how to do this
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/RedeemRealMoneyPurchases', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    // idk how to do
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimMfaEnabled', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (ApplyProfileChanges.length > 0) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', async (request, reply) => {
        const { operation } = request.params;
        console.warn(`Missing/Unsupported MCP Operation: ${operation}`);
        console.warn(request.body);
        console.warn(request.query);

        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        let profile = profiles.profiles[request.query.profileId];
        const memory = functions.GetVersionInfo(request);

        if (request.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

        if (profile.rvn == profile.commandRevision) {
            profile.rvn += 1;

            if (request.query.profileId == "athena") {
                if (!profile.stats.attributes.last_applied_loadout) profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
            }

            await profiles.updateOne({ $set: { [`profiles.${request.query.profileId}`]: profile } });
        }

        let MultiUpdate = [];
        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if ((request.query.profileId == "common_core")) {
            let athena = profiles.profiles["athena"];
            MultiUpdate = [{
                "profileRevision": athena.rvn || 0,
                "profileId": "athena",
                "profileChangesBaseRevision": athena.rvn || 0,
                "profileChanges": [{
                    "changeType": "fullProfileUpdate",
                    "profile": athena
                }],
                "profileCommandRevision": athena.commandRevision || 0,
            }];
        }

        if (QueryRevision != ProfileRevisionCheck) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: MultiUpdate,
            responseVersion: 1
        });
    })

    fastify.post("/fortnite/api/game/v2/profile/:accountId/dedicated_server/:operation", async (request, reply) => {
        const { operation } = request.params;
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        if (!profiles) return reply.status(404).send();

        let profile = profiles.profiles[request.query.profileId];

        let ApplyProfileChanges = [];
        let BaseRevision = profile.rvn;
        let QueryRevision = request.query.rvn || -1;

        if (QueryRevision != BaseRevision) {
            ApplyProfileChanges = [{
                "changeType": "fullProfileUpdate",
                "profile": profile
            }];
        }

        reply.status(200).send({
            profileRevision: profile.rvn || 0,
            profileId: request.query.profileId,
            profileChangesBaseRevision: BaseRevision,
            profileChanges: ApplyProfileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1
        });
    });
}

module.exports = mcp;