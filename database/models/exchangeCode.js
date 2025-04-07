const mongoose = require('mongoose');

const ExchangeCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true, default: new Date(Date.now() + 20 * 60 * 1000) },
}, { timestamps: true });

ExchangeCodeSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ExchangeCode', ExchangeCodeSchema);
