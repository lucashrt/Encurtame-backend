const axios = require('axios');
const redisClient = require('../cache/redisClient.js');

async function isUrlSafe(urlToCheck) {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

    const urlCheck = new URL(urlToCheck);
    const urlCheckSafe = `${urlCheck.protocol}//${urlCheck.hostname}`;

    const safeKey = `safe:${urlCheckSafe}`;
    const maliciousKey = `malicious:${urlToCheck}`;

    const isSafe = await redisClient.get(safeKey);
    if (isSafe) {
        return {
            isSafe: true,
            threats: [],
            error: false
        };
    }
    const isMalicious = await redisClient.get(maliciousKey);
    if (isMalicious) {
        return {
            isSafe: false,
            threats: JSON.parse(isMalicious),
            error: false
        };
    }
    
    const requestBody = {
        client: {
            clientId: "url-shortener",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: urlToCheck }]
        }
    };

    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
            requestBody,
            { timeout: 10000 }
        );

        const threats = response.data?.matches;
        const isSafe = !threats || threats.length === 0;

        if (isSafe) {
            await redisClient.set(safeKey, 'true');
        } else {
            await redisClient.set(maliciousKey, JSON.stringify(threats));
        }

        return {
            isSafe: !threats || threats.length === 0,
            threats: threats || [],
            error: false
        };
    } catch (err) {
        console.error("Error in Safe Browsing:", {
            message: err.message,
            code: err.code,
            status: err.response?.status,
            data: err.response?.data,
            stack: err.stack,
        });
        return { isSafe: false, threats: [], error: true };
    }
}

module.exports = isUrlSafe;