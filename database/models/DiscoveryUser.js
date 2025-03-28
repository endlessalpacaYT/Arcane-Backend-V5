const mongoose = require('mongoose');

const DiscoveryUserSchema = new mongoose.Schema({
    accountId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true, unique: true },
    profile: {
        page: { type: Object, default: {} },
        discoverySurface: { type: Object, default: [] }
    },
    recentlyPlayed: { type: Object, default: {} },
    favorites: { type: Array, default: [] },
    createdIslands: { type: Array, default: [] },
    createdIslands_Frontend: { type: Array, default: [] },
    lastUpdated: { type: String, default: new Date().toISOString() }
});

const model = mongoose.model("discovery_user", DiscoveryUserSchema);

module.exports = model;