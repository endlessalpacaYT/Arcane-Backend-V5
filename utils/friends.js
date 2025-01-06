const Friends = require("../database/models/friends.js");
const functions = require("./functions.js");

async function sendFriendReq(fromId, toId) {
    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    fromFriends.outgoing.push({
        accountId: to.accountId,
        mutual: 0,
        groups: [],
        alias: "",
        note: "",
        favorite: false,
        created: new Date().toISOString()
    });

    functions.sendXmppMessageToId({
        "payload": {
            "accountId": to.accountId,
            "status": "PENDING",
            "direction": "OUTBOUND",
            "created": new Date().toISOString(),
            "favorite": false
        },
        "type": "com.epicgames.friends.core.apiobjects.Friend",
        "timestamp": new Date().toISOString()
    }, from.accountId);

    toFriends.incoming.push({
        accountId: from.accountId,
        mutual: 0,
        groups: [],
        alias: "",
        note: "",
        favorite: false,
        created: new Date().toISOString()
    });

    functions.sendXmppMessageToId({
        "payload": {
            "accountId": from.accountId,
            "status": "PENDING",
            "direction": "INBOUND",
            "created": new Date().toISOString(),
            "favorite": false
        },
        "type": "com.epicgames.friends.core.apiobjects.Friend",
        "timestamp": new Date().toISOString()
    }, to.accountId);

    await from.updateOne({ $set: { list: fromFriends } });
    await to.updateOne({ $set: { list: toFriends } });

    return true;
}

async function acceptFriendReq(fromId, toId) {
    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    let incomingIndex = fromFriends.incoming.findIndex(i => i.accountId == to.accountId);

    if (incomingIndex != -1) {
        fromFriends.incoming.splice(incomingIndex, 1);
        fromFriends.accepted.push({
            accountId: to.accountId,
            groups: [],
            alias: "",
            note: "",
            favorite: false,
            created: new Date().toISOString()
        });

        functions.sendXmppMessageToId({
            "payload": {
                "accountId": to.accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "created": new Date().toISOString(),
                "favorite": false
            },
            "type": "com.epicgames.friends.core.apiobjects.Friend",
            "timestamp": new Date().toISOString()
        }, from.accountId);

        toFriends.outgoing.splice(toFriends.outgoing.findIndex(i => i.accountId == from.accountId), 1);
        toFriends.accepted.push({
            accountId: from.accountId,
            groups: [],
            alias: "",
            note: "",
            favorite: false,
            created: new Date().toISOString()
        });

        functions.sendXmppMessageToId({
            "payload": {
                "accountId": from.accountId,
                "status": "ACCEPTED",
                "direction": "OUTBOUND",
                "created": new Date().toISOString(),
                "favorite": false
            },
            "type": "com.epicgames.friends.core.apiobjects.Friend",
            "timestamp": new Date().toISOString()
        }, to.accountId);

        await from.updateOne({ $set: { list: fromFriends } });
        await to.updateOne({ $set: { list: toFriends } });
    }

    return true;
}

async function deleteFriend(fromId, toId) {
    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });
    let toFriends = to.list;

    let removed = false;

    for (let listType in fromFriends) {
        let findFriend = fromFriends[listType].findIndex(i => i.accountId == to.accountId);
        let findToFriend = toFriends[listType].findIndex(i => i.accountId == from.accountId);

        if (findFriend != -1) {
            fromFriends[listType].splice(findFriend, 1);
            removed = true;
        }

        if (listType == "blocked") continue;

        if (findToFriend != -1) toFriends[listType].splice(findToFriend, 1);
    }

    if (removed == true) {
        functions.sendXmppMessageToId({
            "payload": {
                "accountId": to.accountId,
                "reason": "DELETED"
            },
            "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
            "timestamp": new Date().toISOString()
        }, from.accountId);

        functions.sendXmppMessageToId({
            "payload": {
                "accountId": from.accountId,
                "reason": "DELETED"
            },
            "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
            "timestamp": new Date().toISOString()
        }, to.accountId);

        await from.updateOne({ $set: { list: fromFriends } });
        await to.updateOne({ $set: { list: toFriends } });
    }

    return true;
}

async function clearFriends(accountId) {
    let friends = await Friends.findOne({ accountId: accountId });
    let friendsList = friends.list.accepted;
    let accountIds = [];


    friendsList.forEach(friend => {
        accountIds.push(friend.accountId);
    });
    friends.list.accepted = [];

    for (let accountId in accountIds) {
        functions.sendXmppMessageToId({
            "payload": {
                "accountId": accountId,
                "reason": "DELETED"
            },
            "type": "com.epicgames.friends.core.apiobjects.FriendRemoval",
            "timestamp": new Date().toISOString()
        }, friends.accountId);
    }

    await friends.updateOne({ $set: { list: friendsList } });

    return true;
}

async function blockFriend(fromId, toId) {
    await deleteFriend(fromId, toId);

    let from = await Friends.findOne({ accountId: fromId });
    let fromFriends = from.list;

    let to = await Friends.findOne({ accountId: toId });

    fromFriends.blocked.push({ accountId: to.accountId, created: new Date().toISOString() });

    await from.updateOne({ $set: { list: fromFriends } });

    return true;
}

module.exports = {
    sendFriendReq,
    acceptFriendReq,
    deleteFriend,
    clearFriends,
    blockFriend
}