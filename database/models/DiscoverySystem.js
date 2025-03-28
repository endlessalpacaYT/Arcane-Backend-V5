const mongoose = require('mongoose');

const DiscoverySystemSchema = new mongoose.Schema({}, { strict: false });

const model = mongoose.model("discovery_system", DiscoverySystemSchema);

module.exports = model;