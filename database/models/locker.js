require("dotenv").config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");

const LockerSchema = new mongoose.Schema(
    {
        activeLoadoutGroup: {
            deploymentId: { type: String, default: uuidv4().replace(/-/ig, "") },
            accountId: { type: String, unique: true, required: true },
            athenaItemId: { type: String, default: uuidv4().replace(/-/ig, "") },
            creationTime: { type: String, default: new Date().toISOString() },
            updatedTime: { type: String, default: new Date().toISOString() },
            loadouts: { type: Object, required: true },
            shuffleType: { type: String, default: "DISABLED" }
        },
        loadoutGroupPresets: { type: Array, default: [] },
        loadoutPresets: { type: Array, default: [] }
    },
    {
        collection: "locker"
    }
)

const model = mongoose.model("locker", LockerSchema);

module.exports = model;