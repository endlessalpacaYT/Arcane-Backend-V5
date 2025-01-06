const mongoose = require('mongoose');
const profilesDB = require("../connectProfileDB");

const ProfilesSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        accountId: { type: String, required: true, unique: true },
        profiles: { type: Object, required: true }
    },
    {
        collection: "profiles"
    }
)

const model = profilesDB().model("Profiles", ProfilesSchema);

module.exports = model;