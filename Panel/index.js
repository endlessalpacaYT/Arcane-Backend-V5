require("dotenv").config();
const express = require('express');
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const logger = require('../utils/logger');

const app = express();
const PORT = 5500;

const SecretKey = uuidv4();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect("/index.html");
})

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    logger.panel(`Arcane Panel is running at http://localhost:${PORT}`);
    logger.panel(`Secret Key: ${SecretKey}`);
});