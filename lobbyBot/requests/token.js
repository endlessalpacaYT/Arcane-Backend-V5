require("dotenv").config();
const axios = require("axios");

async function obtainToken() {
    const response = await axios.post(
        `http://${process.env.HOST}:${process.env.PORT}/account/api/oauth/token`,
        {
            "grant_type": "password",
            "token_type": "eg1",
            "username": global.botEmail,
            "password": process.env.PASSWORD
        },
        {
            headers: {
                'Authorization': 'Basic MTQ4M2JhN2Q2YzAyNDc4MjhjMjZjYzhhNzRhOWExODM6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=',
                'Content-Type': 'application/json'
            }
        }
    )

    return response.data;
}

async function refresh_token() {

}

module.exports = {
    obtainToken
}