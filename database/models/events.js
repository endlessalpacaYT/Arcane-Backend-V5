const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const EventsSchema = new mongoose.Schema(
    {
        id: { type: String, default: uuidv4() },
        gameId: { type: String, default: "Fortnite" },
        eventId: { type: String, required: true },
        regions: { type: Array, default: ["EU"] },
        regionMappings: { type: Object, default: {} },
        platforms: {
            type: Array,
            default: [
                "XboxOneGDK",
                "PS4",
                "XboxOne",
                "XSX",
                "Android",
                "PS5",
                "Switch",
                "Windows"
            ]
        },
        platformMappings: { type: Object, default: {} },
        displayDataId: { type: String, required: true },
        eventGroup: { type: String, default: "" },
        announcementTime: { type: String, required: true },
        appId: { type: String, default: null },
        environment: { type: String, default: null },
        metadata: {
            type: Map,
            of: String,
            default: {
                "minimumAccountLevel": 0
            },
        },
        eventWindows: { type: Array, default: [] },
        beginTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },
    {
        collection: "events"
    }
)

const model = mongoose.model("events", EventsSchema);

module.exports = model;