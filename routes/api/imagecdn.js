const path = require('path');
const fs = require('fs');

async function imageCDN(fastify, options) {
    fastify.get('/imagecdn/:image', (request, reply) => {
        const imagePath = path.join(__dirname, '..', '..', 'images', request.params.image);
        
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                reply.status(404).send({ error: 'Image not found' });
            } else {
                fs.readFile(imagePath, (err, data) => {
                    if (err) {
                        reply.status(500).send({ error: 'Error reading image' });
                    } else {
                        reply.type('image/png').send(data); // Adjust the MIME type as needed
                    }
                });
            }
        });
    });
}

module.exports = imageCDN;