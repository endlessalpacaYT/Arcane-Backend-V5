const sjcl = require("sjcl");
const { v4: uuidv4 } = require("uuid");

const functions = require("../../utils/functions");
const tokenVerify = require("../../middlewares/tokenVerify.js");

const User = require("../../database/models/user.js");
const Friends = require("../../database/models/friends.js");

global.parties = [];
let pings = [];

async function party(fastify, options) {
    fastify.get("/fortnite/api/game/v2/voice/:accountId/login", async (request, reply) => {
        const { accountId } = request.params;
        const user_uri = `sip:.24753-evora-89674-udash.${accountId}.@mtu1xp.vivox.com`;

        const d = new Date();
        d.setHours(d.getHours() + 2);
        const vivoxClaims = {
            "iss": "24753-evora-89674-udash",
            "exp": Math.floor(d.getTime() / 1000),
            "vxa": "login",
            "vxi": Math.round(Math.random() * 1000000),
            "f": user_uri,
        };

        const token = vxGenerateToken("zcETsPpEAysznTyDXK4TEzwLQPcTvTAO", JSON.stringify(vivoxClaims));

        return reply.status(200).send({ token: token });
    });

    fastify.get("/fortnite/api/game/v2/voice/:accountId/join/:pid", async (request, reply) => {
        const { accountId, pid } = request.params;
        const channel_uri = `sip:confctl-g-24753-evora-89674-udash.${pid}@mtu1xp.vivox.com`;
        const user_uri = `sip:.24753-evora-89674-udash.${accountId}.@mtu1xp.vivox.com`;

        const d = new Date();
        d.setHours(d.getHours() + 2);
        const vivoxClaims = {
            "iss": "24753-evora-89674-udash",
            "exp": Math.floor(d.getTime() / 1000),
            "vxa": "join",
            "vxi": Math.round(Math.random() * 1000000),
            "f": user_uri,
            "t": channel_uri,
        };

        const token = vxGenerateToken("zcETsPpEAysznTyDXK4TEzwLQPcTvTAO", JSON.stringify(vivoxClaims));

        return reply.status(200).send({ token: token });
    });

    // will mostly be skidded but idrc
    // gonna rewrite i promise
    fastify.get('/party/api/v1/Fortnite/user/:accountId/notifications/undelivered/count', async (request, reply) => {
        let p = global.parties.find(y => y.members.findIndex(x => x.account_id == request.params.accountId) != -1);
        return reply.status(200).send({
            "pings": pings.filter(x => x.id == request.params.accountId).length,
            "invites": p ? p.invites.filter(p => p.sent_to == request.params.accountId).length : 0,
        });
    });

    fastify.get('/party/api/v1/Fortnite/user/:accountId', async (request, reply) => {
        let p = global.parties.find(y => y.members.findIndex(x => x.account_id == request.params.accountId) != -1);
        return reply.status(200).send({
            "current": p ? p : [],
            "pending": [],
            "invites": [],
            "pings": pings.filter(x => x.id == request.params.accountId)
        });
    });

    fastify.post("/party/api/v1/Fortnite/parties", async (request, reply) => {
        if (!request.body.join_info) return reply.status(200).send({});
        if (!request.body.join_info.connection) return reply.status(200).send({});

        const id = uuidv4().replace(/-/ig, "");
        let party = {
            "id": id,
            "created_at": new Date().toISOString(),
            "updated_at": new Date().toISOString(),
            "config": request.body.config,
            "members": [{
                "account_id": (request.body.join_info.connection.id || "").split("@prod")[0],
                "meta": request.body.join_info.meta || {},
                "connections": [
                    {
                        "id": request.body.join_info.connection.id || "",
                        "connected_at": new Date().toISOString(),
                        "updated_at": new Date().toISOString(),
                        "yield_leadership": request.body.join_info.connection.yield_leadership || false,
                        "meta": request.body.join_info.connection.meta || {}
                    }
                ],
                "revision": 0,
                "updated_at": new Date().toISOString(),
                "joined_at": new Date().toISOString(),
                "role": "CAPTAIN"
            }],
            "applicants": [],
            "meta": request.body.meta || {},
            "invites": [],
            "revision": 0,
            "intentions": []
        };
        global.parties.push(party);
        reply.status(200).send(party);
    });

    fastify.patch("/party/api/v1/Fortnite/parties/:pid", { preHandler: tokenVerify }, async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];

        let editingMember = newp.members.find(m => m.account_id == request.user.account_id);
        if (editingMember && editingMember.role != "CAPTAIN") return reply.status(403).send();

        if (request.body.config) {
            for (let prop of Object.keys(request.body.config)) {
                newp.config[prop] = request.body.config[prop];
            }
        }

        if (request.body.meta) {
            for (let prop of request.body.meta.delete) {
                delete newp.meta[prop];
            }

            for (let prop of Object.keys(request.body.meta.update)) {
                newp.meta[prop] = request.body.meta.update[prop];
            }
        }

        newp.revision = request.body.revision;

        const captain = newp.members.find((member) => member.role === "CAPTAIN");

        newp.updated_at = new Date().toISOString();
        global.parties[partyIndex] = newp;

        reply.status(204).send();
        newp.members.forEach(async (member) => {
            functions.sendXmppMessageToId(member.account_id, {
                captain_id: captain.account_id,
                created_at: newp.created_at,
                invite_ttl_seconds: 14400,
                max_number_of_members: newp.config.max_size,
                ns: "Fortnite",
                party_id: newp.id,
                party_privacy_type: newp.config.joinability,
                party_state_overriden: {},
                party_state_removed: request.body.meta.delete,
                party_state_updated: request.body.meta.update,
                party_sub_type: newp.meta['urn:epic:cfg:party-type-id_s'],
                party_type: "DEFAULT",
                revision: newp.revision,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.PARTY_UPDATED",
                updated_at: new Date().toISOString(),
            });
        });
    });

    fastify.patch("/party/api/v1/Fortnite/parties/:pid/members/:accountId/meta", { preHandler: tokenVerify }, async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        let mIndex;
        for (let member of newp.members) {
            if (member.account_id == request.params.accountId) {
                mIndex = newp.members.indexOf(member);
                break;
            }
        }
        let member = newp.members[mIndex];
        if (!member) return reply.status(404).send();
        if (request.user.account_id != request.params.accountId) return reply.status(403).send();

        for (let prop of Object.keys(request.body.delete)) {
            delete member.meta[prop];
        }

        for (let prop of Object.keys(request.body.update)) {
            member.meta[prop] = request.body.update[prop];
        }

        member.revision = request.body.revision;

        member.updated_at = new Date().toISOString();
        newp.members[mIndex] = member;
        newp.updated_at = new Date().toISOString();
        global.parties[partyIndex] = newp;

        reply.status(204).send();
        newp.members.forEach(async (member2) => {
            functions.sendXmppMessageToId(member2.account_id, {
                "account_id": request.params.accountId,
                "account_dn": member.meta["urn:epic:member:dn_s"],
                "member_state_updated": request.body.update,
                "member_state_removed": request.body.delete,
                "member_state_overridden": {},
                "party_id": newp.id,
                "updated_at": new Date().toISOString(),
                "sent": new Date().toISOString(),
                "revision": member.revision,
                "ns": "Fortnite",
                "type": "com.epicgames.social.party.notification.v0.MEMBER_STATE_UPDATED",
            });
        });
    });

    fastify.get("/party/api/v1/Fortnite/parties/:pid", async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        reply.status(200).send(newp);
    });

    fastify.delete("/party/api/v1/Fortnite/parties/:pid/members/:accountId", { preHandler: tokenVerify }, async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        let mIndex;
        for (let member of newp.members) {
            if (member.account_id == request.params.accountId) {
                mIndex = newp.members.indexOf(member);
                break;
            }
        }
        let member = newp.members[mIndex];
        if (request.user.account_id != request.params.accountId && !member.captain) reply.status(404).send();

        newp.members.forEach(async (member) => {
            functions.sendXmppMessageToId(member.account_id, {
                account_id: request.params.accountId,
                member_state_update: {},
                ns: "Fortnite",
                party_id: newp.id,
                revision: newp.revision || 0,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.MEMBER_LEFT"
            });
        });

        newp.members.splice(mIndex, 1);

        reply.status(204).send();
        if (newp.members.length == 0) {
            delete global.parties[partyIndex];
        } else {
            let v = newp.meta['Default:RawSquadAssignments_j'] ? 'Default:RawSquadAssignments_j' : 'RawSquadAssignments_j'
            if (newp.meta[v]) {
                let rsa = JSON.parse(newp.meta[v]);
                rsa.RawSquadAssignments.splice(rsa.RawSquadAssignments.findIndex(a => a.memberId == request.params.accountId), 1);
                newp.meta[v] = JSON.stringify(rsa);

                let captain = newp.members.find((member) => member.role === "CAPTAIN");
                if (!captain) {
                    newp.members[0].role = "CAPTAIN";
                    captain = newp.members[0];
                }

                newp.updated_at = new Date().toISOString();
                global.parties[partyIndex] = newp;
                newp.members.forEach(async (member) => {
                    functions.sendXmppMessageToId(member.account_id, {
                        captain_id: captain.account_id,
                        created_at: newp.created_at,
                        invite_ttl_seconds: 14400,
                        max_number_of_members: 16,
                        ns: "Fortnite",
                        party_id: newp.id,
                        party_privacy_type: newp.config.joinability,
                        party_state_overriden: {},
                        party_state_removed: [],
                        party_state_updated: {
                            [v]: JSON.stringify(rsa)
                        },
                        party_sub_type: newp.meta['urn:epic:cfg:party-type-id_s'],
                        party_type: "DEFAULT",
                        revision: newp.revision,
                        sent: new Date().toISOString(),
                        type: "com.epicgames.social.party.notification.v0.PARTY_UPDATED",
                        updated_at: new Date().toISOString(),
                    });
                });
            }
        }
    });

    fastify.post("/party/api/v1/Fortnite/parties/:pid/members/:accountId/join", { preHandler: tokenVerify }, async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        let mIndex = -1;
        for (let member of newp.members) {
            if (member.account_id == request.params.accountId) {
                mIndex = newp.members.indexOf(member);
                break;
            }
        }
        if (mIndex != -1) return {
            status: "JOINED",
            party_id: newp.id,
        };

        let mem = {
            "account_id": (request.body.connection.id || "").split("@prod")[0],
            "meta": request.body.meta || {},
            "connections": [
                {
                    "id": request.body.connection.id || "",
                    "connected_at": new Date().toISOString(),
                    "updated_at": new Date().toISOString(),
                    "yield_leadership": request.body.connection.yield_leadership ? true : false,
                    "meta": request.body.connection.meta || {}
                }
            ],
            "revision": 0,
            "updated_at": new Date().toISOString(),
            "joined_at": new Date().toISOString(),
            "role": request.body.connection.yield_leadership ? "CAPTAIN" : "MEMBER"
        };
        newp.members.push(mem);
        let v = newp.meta['Default:RawSquadAssignments_j'] ? 'Default:RawSquadAssignments_j' : 'RawSquadAssignments_j'
        let rsa;
        if (newp.meta[v]) {
            rsa = JSON.parse(newp.meta[v]);
            rsa.RawSquadAssignments.push({
                memberId: (request.body.connection.id || "").split("@prod")[0],
                absoluteMemberIdx: newp.members.length - 1
            });
            newp.meta[v] = JSON.stringify(rsa);
            newp.revision++;
        }
        newp.updated_at = new Date().toISOString();
        global.parties[newp.id] = newp;

        const captain = newp.members.find((member) => member.role === "CAPTAIN");

        reply.status(200).send({
            status: "JOINED",
            party_id: newp.id,
        });
        newp.members.forEach(async (member) => {
            functions.sendXmppMessageToId(member.account_id, {
                account_dn: request.body.connection.meta["urn:epic:member:dn_s"],
                account_id: (request.body.connection.id || "").split("@prod")[0],
                connection: {
                    connected_at: new Date().toISOString(),
                    id: request.body.connection.id,
                    meta: request.body.connection.meta,
                    updated_at: new Date().toISOString(),
                },
                joined_at: new Date().toISOString(),
                member_state_updated: request.body.meta || {},
                ns: "Fortnite",
                party_id: newp.id,
                revision: 0,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.MEMBER_JOINED",
                updated_at: new Date().toISOString(),
            });

            functions.sendXmppMessageToId(member.account_id, {
                captain_id: captain.account_id,
                created_at: newp.created_at,
                invite_ttl_seconds: 14400,
                max_number_of_members: newp.config.max_size,
                ns: "Fortnite",
                party_id: newp.id,
                party_privacy_type: newp.config.joinability,
                party_state_overriden: {},
                party_state_removed: [],
                party_state_updated: {
                    [v]: JSON.stringify(rsa)
                },
                party_sub_type: newp.meta['urn:epic:cfg:party-type-id_s'],
                party_type: "DEFAULT",
                revision: newp.revision,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.PARTY_UPDATED",
                updated_at: new Date().toISOString(),
            });
        });
    });

    fastify.post("/party/api/v1/Fortnite/parties/:pid/members/:accountId/promote", { preHandler: tokenVerify }, async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        const captain = newp.members.findIndex((member) => member.role === "CAPTAIN");
        if (newp.members[captain].account_id != request.user.account_id) reply.status(403).send();
        const newCaptain = newp.members.findIndex((member) => member.account_id === request.params.accountId);
        if (captain != -1) {
            newp.members[captain].role = "MEMBER";
        }
        if (newCaptain != -1) {
            newp.members[newCaptain].role = "CAPTAIN";
        }

        newp.updated_at = new Date().toISOString();
        global.parties[global.parties.findIndex(p => p.id == request.params.pid)] = newp;

        reply.status(204).send();
        newp.members.forEach(async (member) => {
            functions.sendXmppMessageToId(member.account_id, {
                account_id: request.params.accountId,
                member_state_update: {},
                ns: "Fortnite",
                party_id: newp.id,
                revision: newp.revision || 0,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.MEMBER_NEW_CAPTAIN"
            });
        });
    });

    fastify.post("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId", async (request, reply) => {
        let memory = functions.GetVersionInfo(request);
        let pIndex;
        if ((pIndex = pings.filter(p => p.sent_to == request.params.accountId).findIndex(p => p.sent_by == request.params.pingerId)) != -1)
            pings.splice(pIndex, 1);

        let d = new Date();
        d.setHours(d.getHours() + 1);
        let ping = {
            sent_by: request.params.pingerId,
            sent_to: request.params.accountId,
            sent_at: new Date().toISOString(),
            expires_at: d.toISOString(),
            meta: request.body.meta
        };
        pings.push(ping);
        reply.status(200).send(ping);
        functions.sendXmppMessageToId(request.params.accountId, {
            expires: ping.expires_at,
            meta: request.body.meta,
            ns: "Fortnite",
            pinger_dn: (await User.findOne({ 'accountInfo.id': request.params.pingerId }).lean()).accountInfo.displayName,
            pinger_id: request.params.pingerId,
            sent: ping.sent_at,
            version: memory.build.toString().padEnd(5, 0),
            type: "com.epicgames.social.party.notification.v0.PING"
        });
    });

    fastify.delete("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId", async (request, reply) => {
        let pIndex;
        if ((pIndex = pings.filter(p => p.sent_to == request.params.accountId).findIndex(p => p.sent_by == request.params.pingerId)) != -1)
            pings.splice(pIndex, 1);
        reply.status(204).send();
    });

    fastify.get("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId/parties", async (request, reply) => {
        let query = pings.filter(p => p.sent_to == request.params.accountId && p.sent_by == request.params.pingerId);
        if (query.length == 0) query = [{
            sent_by: request.params.pingerId
        }];

        reply.status(200).send(query.map(y => {
            let party = Object.values(global.parties).find(x => x.members.findIndex(m => m.account_id == y.sent_by) != -1);
            if (!party) return null;
            return {
                id: party.id,
                created_at: party.createdAt,
                updated_at: party.updatedAt,
                config: party.config,
                members: party.members,
                applicants: [],
                meta: party.meta,
                invites: [],
                revision: party.revision || 0
            };
        }).filter(x => x != null));
    });

    fastify.post("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId/join", async (request, reply) => {
        let query = pings.filter(p => p.sent_to == request.params.accountId && p.sent_by == request.params.pingerId);
        if (query.length == 0) query = [{
            sent_by: request.params.pingerId
        }];
        let newp = Object.values(global.parties).find(p => p.members.findIndex(m => m.account_id == query[0].sent_by) != -1);

        let mIndex = -1;
        for (let member of newp.members) {
            if (member.account_id == request.params.accountId) {
                mIndex = newp.members.indexOf(member);
                break;
            }
        }
        if (mIndex != -1) if (mIndex != -1) return {
            status: "JOINED",
            party_id: newp.id,
        };

        let mem = {
            "account_id": (request.body.connection.id || "").split("@prod")[0],
            "meta": request.body.meta || {},
            "connections": [
                {
                    "id": request.body.connection.id || "",
                    "connected_at": new Date().toISOString(),
                    "updated_at": new Date().toISOString(),
                    "yield_leadership": request.body.connection.yield_leadership ? true : false,
                    "meta": request.body.connection.meta || {}
                }
            ],
            "revision": 0,
            "updated_at": new Date().toISOString(),
            "joined_at": new Date().toISOString(),
            "role": request.body.connection.yield_leadership ? "CAPTAIN" : "MEMBER"
        };
        newp.members.push(mem);
        let v = newp.meta['Default:RawSquadAssignments_j'] ? 'Default:RawSquadAssignments_j' : 'RawSquadAssignments_j'
        if (newp.meta[v]) {
            let rsa = JSON.parse(newp.meta[v]);
            rsa.RawSquadAssignments.push({
                memberId: (request.body.connection.id || "").split("@prod")[0],
                absoluteMemberIdx: newp.members.length - 1
            });
            newp.meta[v] = JSON.stringify(rsa);
            newp.revision++;
        }
        newp.updated_at = new Date().toISOString();
        global.parties[newp.id] = newp;

        const captain = newp.members.find((member) => member.role === "CAPTAIN");

        reply.status(200).send({
            status: "JOINED",
            party_id: newp.id,
        });
        newp.members.forEach(async (member) => {
            functions.sendXmppMessageToId(member.account_id, {
                account_dn: request.body.connection.meta["urn:epic:member:dn_s"],
                account_id: (request.body.connection.id || "").split("@prod")[0],
                connection: {
                    connected_at: new Date().toISOString(),
                    id: request.body.connection.id,
                    meta: request.body.connection.meta,
                    updated_at: new Date().toISOString(),
                },
                joined_at: new Date().toISOString(),
                member_state_updated: request.body.meta || {},
                ns: "Fortnite",
                party_id: newp.id,
                revision: 0,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.MEMBER_JOINED",
                updated_at: new Date().toISOString(),
            });

            functions.sendXmppMessageToId(member.account_id, {
                captain_id: captain.account_id,
                created_at: newp.created_at,
                invite_ttl_seconds: 14400,
                max_number_of_members: newp.config.max_size,
                ns: "Fortnite",
                party_id: newp.id,
                party_privacy_type: newp.config.joinability,
                party_state_overriden: {},
                party_state_removed: [],
                party_state_updated: {
                    [v]: JSON.stringify(rsa)
                },
                party_sub_type: newp.meta['urn:epic:cfg:party-type-id_s'],
                party_type: "DEFAULT",
                revision: newp.revision,
                sent: new Date().toISOString(),
                type: "com.epicgames.social.party.notification.v0.PARTY_UPDATED",
                updated_at: new Date().toISOString(),
            });
        });
    });

    fastify.post('/party/api/v1/Fortnite/parties/:pid/invites/:accountId', { preHandler: tokenVerify }, async (request, reply) => {
        let memory = functions.GetVersionInfo(req);
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let newp = global.parties[partyIndex];
        if (!newp) return reply.status(404).send();
        let pIndex;
        if ((pIndex = newp.invites.filter(p => p.sent_to == request.params.accountId).findIndex(p => p.sent_by == request.user.account_id)) != -1)
            newp.invites.splice(pIndex, 1);

        let d = new Date();
        d.setHours(d.getHours() + 1);
        let invite = {
            party_id: newp.id,
            sent_by: request.user.account_id,
            meta: request.body,
            sent_to: request.params.accountId,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            expires_at: d.toISOString(),
            status: 'SENT'
        };

        newp.invites.push(invite);
        newp.updated_at = new Date().toISOString();
        global.parties[partyIndex] = newp;

        let friends = await Friends.findOne({ accountId: request.user.account_id }).cache();
        const inviter = newp.members.find(x => x.account_id == request.user.account_id);

        reply.status(204).send();
        functions.sendXmppMessageToId(request.params.accountId, {
            expires: invite.expires_at,
            meta: request.body,
            ns: "Fortnite",
            party_id: newp.id,
            inviter_dn: inviter.meta['urn:epic:member:dn_s'],
            inviter_id: request.user.account_id,
            invitee_id: request.params.account_id,
            members_count: newp.members.length,
            sent_at: invite.sent_at,
            updated_at: invite.updated_at,
            friends_ids: newp.members.filter(m => friends.list.accepted.find(f => f.accountId == m.account_id)).map(m => m.account_id),
            sent: new Date().toISOString(),
            type: "com.epicgames.social.party.notification.v0.INITIAL_INVITE"
        });
        if (request.query.sendPing == "true") {
            let pIndex;
            if ((pIndex = pings.filter(p => p.sent_to == request.params.accountId).findIndex(p => p.sent_by == request.user.account_id)) != -1)
                pings.splice(pIndex, 1);

            let d = new Date();
            d.setHours(d.getHours() + 1);
            let ping = {
                sent_by: request.user.account_id,
                sent_to: request.params.accountId,
                sent_at: new Date().toISOString(),
                expires_at: d.toISOString(),
                meta: request.body
            };
            pings.push(ping);

            functions.sendXmppMessageToId(request.params.accountId, {
                expires: invite.expires_at,
                meta: request.body.meta,
                ns: "Fortnite",
                pinger_dn: inviter.meta['urn:epic:member:dn_s'],
                pinger_id: request.user.account_id,
                sent: invite.sent_at,
                version: memory.build.toString().padEnd(5, 0),
                type: "com.epicgames.social.party.notification.v0.PING"
            });
        }
    });

    fastify.post("/party/api/v1/Fortnite/members/:accountId/intentions/:senderId", async (request, reply) => {
        let partyIndex = global.parties.findIndex(p => p.id == request.params.pid);
        if (partyIndex === -1) return reply.status(404).send();
        let party = global.parties[partyIndex];
        if (!party) return reply.status(404).send();
        const sender = party.members.find(x => x.account_id == request.params.senderId);
        const captain = party.members.find((member) => member.role === "CAPTAIN");
        let friends = await Friends.findOne({ accountId: request.params.accountId }).cache();

        let d = new Date();
        d.setHours(d.getHours() + 1);
        let intention = {
            "requester_id": request.params.senderId,
            "requester_dn": sender.meta['urn:epic:member:dn_s'],
            "requester_pl": captain.account_id,
            "requester_pl_dn": captain.meta['urn:epic:member:dn_s'],
            "requestee_id": request.params.accountId,
            "meta": request.body,
            "expires_at": d.toISOString(),
            "sent_at": new Date().toISOString(),
        };

        party.intentions.push(intention);
        reply.status(200).send(intention);

        functions.sendXmppMessageToId(request.params.accountId, {
            expires_at: intention.expires_at,
            requester_id: request.params.senderId,
            requester_dn: sender.meta['urn:epic:member:dn_s'],
            requester_pl: captain.account_id,
            requester_pl_dn: captain.meta['urn:epic:member:dn_s'],
            requestee_id: request.params.accountId,
            meta: request.body,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            friends_ids: party.members.filter(m => friends.list.accepted.find(f => f.accountId == m.account_id)).map(m => m.account_id),
            members_count: party.members.length,
            party_id: party.id,
            ns: "Fortnite",
            sent: new Date().toISOString(),
            type: "com.epicgames.social.party.notification.v0.INITIAL_INTENTION"
        });
    });

    // idk
    fastify.post("/party/api/v1/Fortnite/parties/:pid/members/:accountId/conferences/connection", async (request, reply) => {
        reply.status(204).send();
    });

    fastify.get('/party/api/v1/Fortnite/user/:accountId/settings/privacy', (request, reply) => {
        reply.status(200).send({
            "receiveInvites": "ALL",
            "receiveIntentions": "ALL"
        })
    })
}

function base64URLEncode(value) {
    return Buffer.from(value).toString('base64')
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/\=+$/, "");
}

function vxGenerateToken(key, payload) {
    const base64urlHeader = base64URLEncode("{}");
    const base64urlPayload = base64URLEncode(payload);
    const segments = [base64urlHeader, base64urlPayload];
    const toSign = segments.join(".");
    const hmac = new sjcl.misc.hmac(sjcl.codec.utf8String.toBits(key), sjcl.hash.sha256);
    const signature = sjcl.codec.base64.fromBits(hmac.encrypt(toSign));
    const base64urlSigned = signature
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/\=+$/, "");

    segments.push(base64urlSigned);

    return segments.join(".");
}

module.exports = party;