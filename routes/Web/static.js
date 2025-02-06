const fs = require('fs');
const path = require('path');

async function static(fastify, options) {
    fastify.get('/remoteEntry.js', (request, reply) => {
        const Path = path.join(__dirname, '..', '..', 'responses', 'EpicConfig', 'remoteEntry.js');

        fs.access(Path, fs.constants.F_OK, (err) => {
            if (err) {
                reply.status(404).send({ error: 'file not found' });
            } else {
                fs.readFile(Path, (err, data) => {
                    if (err) {
                        reply.status(500).send({ error: 'Error reading file' });
                    } else {
                        reply.type('application/javascript').send(data);
                    }
                });
            }
        });
    });
}

module.exports = static;