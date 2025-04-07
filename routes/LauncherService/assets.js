const fs = require("fs");
const path = require("path");

async function assets(fastify, options) {
    // Catagory: Launcher
    fastify.get('/launcher/api/public/assets/info/launcher/:version', (request, reply) => {
        reply.status(200).send({
            "status": "NOT_DEPRECATED"
        })
    })

    // Catagory: V2
    fastify.get('/launcher/api/public/assets/v2/platform/:platform/launcher/version', (request, reply) => {
        reply.status(200).send({
            "elements": [],
            "buildStatuses": [
                {
                    "app": "EpicGamesLauncher",
                    "status": "NOT_DEPRECATED"
                }
            ]
        })
    })

    fastify.get('/launcher/api/public/assets/v2/platform/:platform/launcher', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "EpicGamesLauncher",
                    "labelName": "Live-HighlandWarrior-Windows",
                    "buildVersion": "3.0.1-c6f7580.b41+Releaselive-defaultInstallerRelease-Windows",
                    "hash": "3ba6d3637498b3a53026fbf52eccf8dc2bc9ecae",
                    "useSignedUrl": false,
                    "metadata": {},
                    "manifests": []
                }
            ]
        })
    })

    fastify.post('/launcher/api/public/assets/v2/platform/:platform/launcher/label/:label', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "EpicGamesLauncher",
                    "labelName": "Live-HighlandWarrior-Windows",
                    "buildVersion": "3.0.1-c6f7580.b41+Releaselive-defaultInstallerRelease-Windows",
                    "hash": "3ba6d3637498b3a53026fbf52eccf8dc2bc9ecae",
                    "useSignedUrl": false,
                    "metadata": {},
                    "manifests": []
                }
            ]
        })
    })

    fastify.post('/launcher/api/public/assets/v2/ticket', (request, reply) => {
        reply.status(200).send({
            "signedTicket": "ArcaneV5",
            "expiresAt": "9998-06-11T20:05:47Z"
        })
    })

    fastify.post('/launcher/api/public/assets/v2/by-ticket/app/:appName', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "Fortnite",
                    "buildVersion": "++Fortnite+Release-25.00-CL-25909622-Windows",
                    "hash": "78cf23202befa88d526de0c8513fe12593f698a9",
                    "useSignedUrl": false,
                    "metadata": {
                        "installationPoolId": "FortniteInstallationPool"
                    },
                    "manifests": []
                }
            ]
        })
    })

    fastify.get('/launcher/api/public/assets/v2/platform/:platform/namespace/:namespace/catalogItem/:catalogItemId/app/:appName/label/:label', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "Fortnite",
                    "labelName": "Live-Windows",
                    "buildVersion": "++Fortnite+Release-25.00-CL-25909622-Windows",
                    "hash": "78cf23202befa88d526de0c8513fe12593f698a9",
                    "useSignedUrl": false,
                    "metadata": {
                        "installationPoolId": "FortniteInstallationPool"
                    },
                    "manifests": []
                }
            ]
        })
    })

    fastify.post('/launcher/api/public/assets/v2/platform/:platform/namespace/:namespace/catalogItem/:catalogItemId/app/:appName/label/:label', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "Fortnite",
                    "labelName": "Live-Android",
                    "buildVersion": "++Fortnite+Release-25.00-CL-25695576-Shipping-Android",
                    "hash": "0a6bf0ced25badee2082ed203de8682540547e33",
                    "useSignedUrl": false,
                    "metadata": {},
                    "manifests": []
                }
            ]
        })
    })

    fastify.get('/launcher/api/public/assets/v2/platform/:platform/catalogItem/:catalogItemId/app/:appName', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "Fortnite",
                    "labelName": "Live-Windows",
                    "buildVersion": "++Fortnite+Release-25.00-CL-25909622-Windows",
                    "hash": "78cf23202befa88d526de0c8513fe12593f698a9",
                    "useSignedUrl": false,
                    "metadata": {
                        "installationPoolId": "FortniteInstallationPool"
                    },
                    "manifests": []
                }
            ]
        })
    })

    fastify.post('/launcher/api/public/assets/v2/platform/:platform/catalogItem/:catalogItemId/app/:appName/label/:label', (request, reply) => {
        reply.status(200).send({
            "elements": [
                {
                    "appName": "Fortnite",
                    "labelName": "Live-Android",
                    "buildVersion": "++Fortnite+Release-25.00-CL-25695576-Shipping-Android",
                    "hash": "0a6bf0ced25badee2082ed203de8682540547e33",
                    "useSignedUrl": false,
                    "metadata": {},
                    "manifests": []
                }
            ]
        })
    })

    // Catagory: Uncatagorized
    fastify.get('/launcher/api/public/assets/:platform/:catalogItemId/:appName', (request, reply) => {
        reply.status(200).send({
            "appName": "Fortnite",
            "labelName": "Live-Windows",
            "buildVersion": "++Fortnite+Release-24.40-CL-25595478-Windows",
            "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
            "metadata": {
                "installationPoolId": "FortniteInstallationPool"
            },
            "expires": "9998-06-01T20:05:31.563Z",
            "items": {
                "MANIFEST": {},
                "CHUNKS": {}
            },
            "assetId": "Fortnite"
        })
    })

    fastify.get('/launcher/api/public/assets/:platform', (request, reply) => {
        reply.status(200).send([
            {
                "appName": "Fortnite_Studio",
                "labelName": "Live-Windows",
                "buildVersion": "++Fortnite+Release-24.40-CL-25595478-Windows",
                "catalogItemId": "1e8bda5cfbb641b9a9aea8bd62285f73",
                "namespace": "fn",
                "metadata": {
                    "installationPoolId": "FortniteInstallationPool"
                },
                "assetId": "Fortnite"
            },
            {
                "appName": "Fortnite",
                "labelName": "Live-Windows",
                "buildVersion": "++Fortnite+Release-30.00-CL-25595478-Windows",
                "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                "namespace": "fn",
                "metadata": {
                    "installationPoolId": "FortniteInstallationPool"
                },
                "assetId": "Fortnite"
            },
            {
                "appName": "afdb5a85efcc45d8ae8e406e2121d81c",
                "labelName": "Live-Windows",
                "buildVersion": "1.1",
                "catalogItemId": "d75daf91c89b49ecb110b69a7bd68996",
                "namespace": "fn",
                "metadata": {
                    "installationPoolId": "FortniteInstallationPool"
                },
                "assetId": "afdb5a85efcc45d8ae8e406e2121d81c"
            },
            {
                "appName": "WorldExplorersLive",
                "labelName": "Live-Windows",
                "buildVersion": "1.88.244-r17036752-Windows",
                "catalogItemId": "a53e821fbdc24181877243a8dbb63463",
                "namespace": "wex",
                "assetId": "WorldExplorersLive"
            }
        ])
    })

    fastify.get('/Builds/Fortnite/CloudDir/ChunksV4/*', (request, reply) => {
        reply.header("Content-Type", "application/octet-stream")

        const chunk = fs.readFileSync(path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudDir", "arcane.chunk"));
        
        reply.status(200).send(chunk);
    })

    fastify.get('/Builds/Fortnite/Content/CloudDir/*', (request, reply) => {
        reply.header("Content-Type", "application/octet-stream")

        const manifest = fs.readFileSync(path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudDir", "arcane.manifest"));
        
        reply.status(200).send(manifest);
    })
}

module.exports = assets;