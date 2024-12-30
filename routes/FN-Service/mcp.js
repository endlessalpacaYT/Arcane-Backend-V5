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

            if (item.slotname == "Dance") {
                // idek why this isnt working
                profile.stats.attributes.favorite_dance[item.indexWithinSlot] = item.itemToSlot;
                profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[item.indexWithinSlot] = templateId;

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": "favorite_dance",
                    "value": profile.stats.attributes["favorite_dance"]
                });
            } else if (item.slotname == "ItemWrap") {
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

        if (request.body.slotname == "Dance") {
            // idek why this isnt working
            profile.stats.attributes.favorite_dance[request.body.indexWithinSlot] = request.body.itemToSlot;
            profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[request.body.indexWithinSlot] = templateId;

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "favorite_dance",
                "value": profile.stats.attributes["favorite_dance"]
            });
        } else if (request.body.slotname == "ItemWrap") {
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
                    const ID = uuidv4();

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

                        if (profile.items[key].quantity < findOfferId.offerId.prices[0].finalPrice) return createError.createError(errors.BAD_REQUEST.mcp.PurchaseCatalogEntry.not_enough_funds, 400, reply);

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
                DailyQuestIDS = AthenaQuestIDS.Daily

                if (AthenaQuestIDS.hasOwnProperty(`Season${SeasonPrefix}`)) {
                    SeasonQuestIDS = AthenaQuestIDS[`Season${SeasonPrefix}`]
                }

                for (let key in profile.items) {
                    if (profile.items[key].templateId.toLowerCase().startsWith("quest:athenadaily")) {
                        QuestCount += 1;
                    }
                }
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
                        if (profile.stats.attributes.quest_manager.dailyQuestRerolls <= 0) {
                            profile.stats.attributes.quest_manager.dailyQuestRerolls += 1;
                        }
                    }
                }
            } else {
                profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();
            }

            if (QuestCount < 3 && ShouldGiveQuest == true) {
                for (let i = 0; i < 3; i++) {
                    const NewQuestID = uuidv4();
                    let randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

                    for (let key in profile.items) {
                        while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
                            randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
                        }
                    }

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
        } catch (err) {
            console.error(err);
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

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimQuestReward', async (request, reply) => {
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
}

module.exports = mcp;