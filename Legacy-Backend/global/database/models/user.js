const mongoose = require('mongoose');
const privacySettings = require('../../../EpicGames/FN-Service/routes/privacySettings');

/*const newUser = new User({
    accountInfo: {
        id: "ArcaneV5",
        displayName: "ArcaneV5",
        email: "developer@arcane.dev"
    },
    security: {
        password: "password"
    }
});*/

const UserSchema = new mongoose.Schema({
    accountInfo: {
        id: { type: String, required: true },
        displayName: { type: String, required: true, unique: true },
        name: { type: String, default: "Arcane" },
        email: { type: String, required: true, unique: true },
        failedLoginAttempts: { type: Number, default: 0 },
        numberOfDisplayNameChanges: { type: Number, default: 0 },
        ageGroup: { type: String, default: "UNKNOWN" },
        headless: { type: Boolean, default: false },
        country: { type: String, default:"EN-GB" },
        lastName: { type: String, default: "Backend" },
        phoneNumber: { type: String, default: "" },
        company: { type: String, default: "" },
        preferredLanguage: { type: String, default: "en-gb" },
        canUpdateDisplayName: { type: Boolean, default: true },
        tfaEnabled: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        minorVerified: { type: Boolean, default: false },
        minorExpected: { type: Boolean, default: false },
        minorStatus: { type: String, default: "NOT_MINOR" },
        cabinedMode: { type: Boolean, default: false },
        hasHashedEmail: { type: Boolean, default: false },
    },
    security: {
        password: { type: String, required: true },
    },
    privacySettings: {
        type: Object,
        default: {},
    },
    metadata: {
        type: Map,
        of: String,
        default: {},
    },
    receipts: { type: Array, default: [] },
    externalAuths: { type: Array, default: [] }
});

module.exports = mongoose.model('users', UserSchema);