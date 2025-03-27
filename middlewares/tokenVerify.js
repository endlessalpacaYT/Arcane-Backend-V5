require("dotenv").config();
const jwt = require("jsonwebtoken");

const errors = require("../responses/errors.json");
const createError = require("../utils/error");

async function verifyToken(request, reply) {
    try {
        const { authorization } = request.headers;

        if (!authorization) {
            return createError.createError({
                "errorCode": "errors.com.epicgames.common.authentication.authentication_failed",
                "errorMessage": `Authentication failed for ${request.url}`,
                "messageVars": [
                    request.url
                ],
                "numericErrorCode": 1032,
                "originatingService": "com.epicgames.account.public",
                "intent": "prod"
            }, 401, reply);
        }
        const token = authorization.replace("bearer ", "");
        const userToken = jwt.verify(token.replace("eg1~", ""), process.env.JWT_SECRET);

        request.user = userToken;
    } catch (err) {
        return createError.createError({
            "errorCode": "errors.com.epicgames.common.authentication.authentication_failed",
            "errorMessage": `Authentication failed for ${request.url}`,
            "messageVars": [
                request.url
            ],
            "numericErrorCode": 1032,
            "originatingService": "com.epicgames.account.public",
            "intent": "prod"
        }, 401, reply);
    }
}

module.exports = verifyToken;