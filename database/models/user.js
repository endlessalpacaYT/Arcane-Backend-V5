const mongoose = require('mongoose');

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
        country: { type: String, default: "EN-GB" },
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
        banned: { type: Boolean, default: false }
    },
    privacySettings: {
        type: Object,
        default: {},
    },
    stats: { type: Array, default: [] },
    metadata: {
        type: Map,
        of: String,
        default: {},
    },
    stash: {
        type: Object,
        default: {},
    },
    arena: {
        hype: { type: Number, default: 0 },
        division: { type: Number, default: 1 },
    },
    receipts: { type: Array, default: [] },
    externalAuths: { type: Array, default: [] }
});

module.exports = mongoose.model('users', UserSchema);