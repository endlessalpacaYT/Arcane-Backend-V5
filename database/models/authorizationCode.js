const mongoose = require('mongoose');

const AuthorizationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    client_id: { type: String, required: true },
    redirectUrl: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true, default: new Date(Date.now() + 10 * 60 * 1000) },
}, { timestamps: true });

AuthorizationCodeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
