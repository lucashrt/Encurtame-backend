require('dotenv').config();

const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("error", function (err) {
    throw err;
});

module.exports = client;