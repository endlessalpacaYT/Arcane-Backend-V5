const DiscoverySystem = require("../database/models/DiscoverySystem");
const DiscoveryUser = require("../database/models/DiscoveryUser");

const mnemonic = require("../responses/fortniteConfig/discovery/mnemonic.json");

const logger = require("./logger");

async function addAllMnemonic(accountId) {
    logger.backend("Setting up discovery, This might take a while!");

    for (let i = 0; i < mnemonic.length; i++) {
        const discoverySystem = new DiscoverySystem(mnemonic[i])
        await discoverySystem.save();
    }
}

module.exports = {
    addAllMnemonic
}