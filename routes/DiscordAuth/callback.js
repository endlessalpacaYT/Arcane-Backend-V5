const User = require("../../database/models/user.js");
const axios = require("axios");
const qs = require("querystring");

// this SHOULD be stored in env but i cba
const CLIENT_ID = "1288855262270193825";
const CLIENT_SECRET = "Eo-eiB9AMu5hYJX3zi0LAF570mM_rbdj";
const REDIRECT_URI = "https://services.ogfn.org/callback";

async function callback(fastify, options) {
    fastify.get('/callback', async (request, reply) => {
        const { code } = request.query;

        if (!code) {
            return reply.status(400).send({ error: 'Authorization code not provided' });
        }

        try {
            const tokenResponse = await axios.post(
                'https://discord.com/api/oauth2/token',
                qs.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const accessToken = tokenResponse.data.access_token;

            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = userResponse.data;
            const discordId = userData.id;

            const user = await User.findOne({ discordId: String(discordId) }).exec();

            if (user) {
                const redirectUrl = `http://127.0.0.1:6476/login?username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`;
                return reply.redirect(redirectUrl);
            } else {
                return reply.type('text/html').send(`
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
                    <title>Jungle Auth!</title>
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            margin: 0;
                            height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
                            animation: gradient 5s ease infinite;
                            color: white;
                        }

                        @keyframes gradient {
                            0% {
                                background-position: 0% 50%;
                            }
                            50% {
                                background-position: 100% 50%;
                            }
                            100% {
                                background-position: 0% 50%;
                            }
                        }

                        .glass {
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 10px;
                            padding: 20px;
                            text-align: center;
                            backdrop-filter: blur(10px);
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                        }

                        h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                    </style>
                </head>
                <body>
                    <div class="glass">
                        <h1>You don't have an account!</h1>
                    </div>
                </body>
                </html>
            `);
            }
        } catch (error) {
            // Handle errors and return an appropriate response
            console.error('OAuth Error:', error.message);
            return reply.status(500).send({ error: 'OAuth failed', details: error.message });
        }
    });
}

module.exports = callback;
