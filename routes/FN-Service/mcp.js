const Profile = require("../../database/models/profile");

const functions = require("../../utils/functions");

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
                "changeType": "itemAttrChanged",
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