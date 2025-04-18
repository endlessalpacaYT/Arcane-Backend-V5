async function settings(fastify, options) {
    fastify.get('/v1/epic-settings/public/users/:accountId/values', (request, reply) => {
        reply.status(200).send({
            "response": {
                "settings": [
                    {
                        "namespace": "stats",
                        "settingName": "show-in-leaderboard",
                        "preferredValue": false,
                        "preferredValueUpdatedAt": 1716557959865,
                        "preferredValueFromOrgLevel": false,
                        "effectiveValue": false,
                        "effectiveSource": "preference",
                        "isOrgLevel": false,
                        "definition": {
                            "orgId": "cc5b83aa-cb5c-4b4b-a800-a7dd64edacc0",
                            "productId": "6fdb114c-3fbc-4ced-bc5b-55bcdba5c8f6",
                            "namespace": "stats",
                            "settingName": "show-in-leaderboard",
                            "valueType": "boolean",
                            "allowProductOverrides": "ageBrackets",
                            "inheritFromOrg": true,
                            "translations": {
                                "en": {
                                    "label": "Show on career leaderboard",
                                    "userNotice": "Show on career leaderboard",
                                    "parentNotice": "Show on career leaderboard"
                                }
                            },
                            "options": [],
                            "restrictiveOrder": "falseRestrictive",
                            "userHidden": false,
                            "required": false,
                            "dataStorage": "raw",
                            "ageBracket": {
                                "consentTypeRequired": "none",
                                "consentType": "none",
                                "applyConsentToEnforcedUsersOnly": false,
                                "defaultValue": true,
                                "defaultPreference": true,
                                "enforcedLimit": true
                            }
                        }
                    }
                ]
            },
            "meta": {
                "requestId": "85d79fc0-1ea6-11ef-93cc-1d39db92cdb2",
                "timestamp": new Date().toISOString()
            }
        })
    })

    // idk the response
    fastify.post('/v1/verifications/send-email', (request, reply) => {
        reply.status(204).send();
    })

    fastify.patch('/v1/epic-settings/public/users/:accountId/values', (request, reply) => {
        reply.status(200).send({
            "response": {
                "settings": [
                    {
                        "namespace": "stats",
                        "settingName": "show-in-leaderboard",
                        "effectiveValue": true,
                        "effectiveSource": "preference"
                    }
                ]
            },
            "meta": {
                "requestId": "48a54900-1eaa-11ef-b3fd-b19a317b502f",
                "timestamp": "2024-05-30T17:30:18.384Z"
            }
        })
    })
}

module.exports = settings;