require("dotenv").config();
const fs = require("fs");
const path = require("path");

const Profile = require("../../database/models/profile");

const createError = require("../../utils/error");
const errors = require("../../responses/errors.json");

const functions = require("../../utils/functions");

const { v4: uuidv4 } = require("uuid");

function queryLoadout(profile, activeLoadout) {
    let loadouts = {
        "CosmeticLoadout:LoadoutSchema_Emotes": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Platform": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Sparks": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Wraps": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Jam": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Vehicle": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        },
        "CosmeticLoadout:LoadoutSchema_Character": {
            "loadoutSlots": [],
            "shuffleType": "DISABLED"
        }
    }

    for (let i = 0; i < profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items.length; i++) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[i];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Emotes"].loadoutSlots.push({
                "slotTemplate": `CosmeticLoadoutSlotTemplate:LoadoutSlot_Emote_${i}`,
                "equippedItemId": `AthenaDance:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    for (let i = 0; i < profile.items[activeLoadout].attributes.locker_slots_data.slots.ItemWrap.items.length; i++) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.ItemWrap.items[i];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Wraps"].loadoutSlots.push({
                "slotTemplate": `CosmeticLoadoutSlotTemplate:LoadoutSlot_Wrap_${i}`,
                "equippedItemId": `AthenaItemWrap:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.banner_icon_template) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.banner_icon_template;
        if (itemId) {
            loadouts["CosmeticLoadout:LoadoutSchema_Platform"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Banner_Icon",
                "equippedItemId": `HomebaseBannerIcon:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.banner_color_template) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.banner_color_template;
        if (itemId) {
            loadouts["CosmeticLoadout:LoadoutSchema_Platform"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Banner_Color",
                "equippedItemId": `HomebaseBannerColor:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.MusicPack.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.MusicPack.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Platform"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_LobbyMusic",
                "equippedItemId": `AthenaMusicPack:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.LoadingScreen.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.LoadingScreen.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Platform"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_LoadingScreen",
                "equippedItemId": `AthenaLoadingScreen:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.Character.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.Character.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Character"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Character",
                "equippedItemId": `AthenaCharacter:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.Pickaxe.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.Pickaxe.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Character"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Pickaxe",
                "equippedItemId": `AthenaPickaxe:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.Glider.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.Glider.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Character"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Glider",
                "equippedItemId":`"AthenaGlider:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.SkyDiveContrail.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.SkyDiveContrail.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Character"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Contrails",
                "equippedItemId": `AthenaSkyDiveContrail:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    if (profile.items[activeLoadout].attributes.locker_slots_data.slots.Backpack.items[0]) {
        let itemId = profile.items[activeLoadout].attributes.locker_slots_data.slots.Backpack.items[0];
        if (itemId) {
            itemId = itemId.split(":")[1];
            loadouts["CosmeticLoadout:LoadoutSchema_Character"].loadoutSlots.push({
                "slotTemplate": "CosmeticLoadoutSlotTemplate:LoadoutSlot_Backpack",
                "equippedItemId": `AthenaBackpack:${itemId.toLowerCase()}`,
                "itemCustomizations": []
            });
        }
    }

    return loadouts;
}

async function locker(fastify, options) {
    fastify.get('/api/locker/v4/:deploymentId/account/:accountId/items', async (request, reply) => {
        const profiles = await Profile.findOne({ accountId: request.params.accountId });
        if (!profiles) return reply.status(404).send();
        const profile = profiles.profiles["athena"];

        let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
        const loadouts = queryLoadout(profile, activeLoadout);

        reply.status(200).send({
            "activeLoadoutGroup": {
                "deploymentId": request.params.deploymentId,
                "accountId": request.params.accountId,
                "athenaItemId": uuidv4(),
                "creationTime": "2024-11-02T15:09:28.592644953Z",
                "updatedTime": "2025-01-31T19:02:46.057799715Z",
                "loadouts": loadouts,
                "shuffleType": "DISABLED"
            },
            "loadoutGroupPresets": [],
            "loadoutPresets": [],
        })
    })
}

module.exports = locker;