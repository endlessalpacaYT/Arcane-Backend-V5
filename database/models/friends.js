const mongoose = require("mongoose");
const database = require("../connect");

const FriendsSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        accountId: { type: String, required: true, unique: true },
        list: {
            type: Object, default: {
                accepted: [],
                incoming: [],
                outgoing: [],
                blocked: [],
                suggested: []
            }
        }
    },
    {
        collection: "friends"
    }
)

const model = database().model('FriendsSchema', FriendsSchema);

module.exports = model;