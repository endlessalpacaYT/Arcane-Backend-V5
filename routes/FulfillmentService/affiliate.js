async function affiliate(fastify, options) {
    fastify.get("/affiliate/api/public/affiliates/slug/:slug", async (request, reply) => {
        const slug = request.params.slug;
        const code = slug.toLowerCase();
        
        return reply.status(200).send({
            "id": code,
            "slug": code,
            "displayName": code,
            "code_higher": slug,
            "status": "ACTIVE",
            "verified": false
        });
    });
}

module.exports = affiliate;