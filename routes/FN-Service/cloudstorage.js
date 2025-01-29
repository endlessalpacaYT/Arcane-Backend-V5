const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const errors = require("../../responses/errors.json");
const createError = require("../../utils/error");
const functions = require("../../utils/functions");

async function cloudstorage(fastify, options) {
    fastify.post('/fortnite/api/cloudstorage/system', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get("/fortnite/api/cloudstorage/system", async (request, reply) => {
        try {
            const dir = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage");

            let CloudFiles = [];

            fs.readdirSync(dir).forEach(name => {
                if (name.toLowerCase().endsWith(".ini")) {
                    const ParsedFile = fs.readFileSync(path.join(dir, name)).toString();
                    const ParsedStats = fs.statSync(path.join(dir, name));

                    CloudFiles.push({
                        "uniqueFilename": name,
                        "filename": name,
                        "hash": crypto.createHash('sha1').update(ParsedFile).digest('hex'),
                        "hash256": crypto.createHash('sha256').update(ParsedFile).digest('hex'),
                        "length": ParsedFile.length,
                        "contentType": "application/octet-stream",
                        "uploaded": ParsedStats.mtime,
                        "storageType": "S3",
                        "storageIds": {},
                        "doNotCache": true
                    });
                }
            });
            reply.status(200).send(CloudFiles);
        } catch (err) {
            console.error(err);
            createError.createError(errors.SERVER_ERROR.common, 500, reply);
        }
    });

    fastify.get("/fortnite/api/cloudstorage/system/:file", (request, reply) => {
        if (request.params.file == "config") {
            return reply.status(200).send(require("../../responses/fortniteConfig/CloudStorage/config.json"));
        }
        const file = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage", path.basename(request.params.file));

        if (fs.existsSync(file)) return reply.status(200).send(fs.readFileSync(file));

        reply.status(200).send();
    });

    fastify.get('/fortnite/api/cloudstorage/system/:file/links', (request, reply) => {
        reply.status(200).send({
            "readLink": "",
            "writeLink": ""
        })
    })

    fastify.put("/fortnite/api/cloudstorage/system/:file", (request, reply) => {
        reply.status(204).send();
    });

    fastify.delete("/fortnite/api/cloudstorage/system/:file", (request, reply) => {
        reply.status(204).send();
    });

    fastify.get('/fortnite/api/cloudstorage/user/config', (request, reply) => {
        const config = require("../../responses/fortniteConfig/CloudStorage/config.json");
        config.enumerateFilesPath = "/api/cloudstorage/user";
        reply.status(200).send(config);
    })

    fastify.post('/fortnite/api/cloudstorage/user/:accountId', async (request, reply) => {
        const clientSettingsPath = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage", "User", request.params.accountId);
        if (!fs.existsSync(clientSettingsPath)) {
            fs.mkdirSync(clientSettingsPath, { recursive: true });
        }
        const memory = functions.GetVersionInfo(request);

        const file = path.join(clientSettingsPath, `ClientSettings-${memory.season}.Sav`);
        if (fs.existsSync(file)) {
            const ParsedFile = fs.readFileSync(file, 'latin1');
            const ParsedStats = fs.statSync(file);

            return reply.send([{
                "uniqueFilename": "ClientSettings.Sav",
                "filename": "ClientSettings.Sav",
                "hash": crypto.createHash('sha1').update(ParsedFile).digest('hex'),
                "hash256": crypto.createHash('sha256').update(ParsedFile).digest('hex'),
                "length": Buffer.byteLength(ParsedFile),
                "contentType": "application/octet-stream",
                "uploaded": ParsedStats.mtime,
                "storageType": "S3",
                "storageIds": {},
                "accountId": request.params.accountId,
                "doNotCache": false
            }]);
        }

        return reply.send([]);
    })

    fastify.get('/fortnite/api/cloudstorage/user', (request, reply) => {
        reply.status(200).send([]);
    })

    fastify.get('/fortnite/api/cloudstorage/user/:accountId', (request, reply) => {
        const clientSettingsPath = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage", "User", request.params.accountId);
        if (!fs.existsSync(clientSettingsPath)) {
            fs.mkdirSync(clientSettingsPath, { recursive: true });
        }
        const memory = functions.GetVersionInfo(request);

        const file = path.join(clientSettingsPath, `ClientSettings-${memory.season}.Sav`);
        if (fs.existsSync(file)) {
            const ParsedFile = fs.readFileSync(file, 'latin1');
            const ParsedStats = fs.statSync(file);

            return reply.send([{
                "uniqueFilename": "ClientSettings.Sav",
                "filename": "ClientSettings.Sav",
                "hash": crypto.createHash('sha1').update(ParsedFile).digest('hex'),
                "hash256": crypto.createHash('sha256').update(ParsedFile).digest('hex'),
                "length": Buffer.byteLength(ParsedFile),
                "contentType": "application/octet-stream",
                "uploaded": ParsedStats.mtime,
                "storageType": "S3",
                "storageIds": {},
                "accountId": request.params.accountId,
                "doNotCache": false
            }]);
        }

        return reply.send([]);
    })

    fastify.get('/fortnite/api/cloudstorage/user/:accountId/:uniqueFilename/links', (request, reply) => {
        reply.status(200).send({
            "readLink": "",
            "writeLink": ""
        })
    })

    fastify.put('/fortnite/api/cloudstorage/user/:accountId/:file', { preHandler: getRawBody }, async (request, reply) => {
        const clientSettingsPath = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage", "User", request.params.accountId);
        if (!fs.existsSync(clientSettingsPath)) {
            fs.mkdirSync(clientSettingsPath, { recursive: true });
        }
        //if (request.params.file.toLowerCase() !== "clientsettings.sav") return reply.code(204).send();

        const memory = functions.GetVersionInfo(request);

        const file = path.join(clientSettingsPath, `ClientSettings-${memory.season}.Sav`);
        fs.writeFileSync(file, request.rawBody, 'latin1');

        return reply.code(204).send();
    })

    fastify.get("/fortnite/api/cloudstorage/user/:accountId/:file", (request, reply) => {
        const clientSettingsPath = path.join(__dirname, "..", "..", "responses", "fortniteConfig", "CloudStorage", "User", request.params.accountId);
        if (!fs.existsSync(clientSettingsPath)) {
            fs.mkdirSync(clientSettingsPath, { recursive: true });
        }

        const memory = functions.GetVersionInfo(request);

        const file = path.join(clientSettingsPath, `ClientSettings-${memory.season}.Sav`);
        if (fs.existsSync(file)) return reply.status(200).send(fs.readFileSync(file));

        return reply.code(200).send();
    });

    fastify.delete('/fortnite/api/cloudstorage/user/:accountId/:file', (request, reply) => {
        reply.status(200).send();
    })

    fastify.get('/fortnite/api/cloudstorage/storage/:accountId/info', (request, reply) => {
        reply.status(200).send({
            "accountId": request.params.accountId,
            "totalStorage": 9223372036854775807,
            "totalUsed": 0
        })
    })

    async function getRawBody(request, reply) {
        request.rawBody = request.body;
        if (!request.rawBody) {
            return reply.code(400).send({ error: 'Empty body received' });
        }
    }
}

module.exports = cloudstorage;