const axios = require('axios');

async function isUrlSafe(urlToCheck) {
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

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
            { timeout: 5000 }
        );

        const threats = response.data?.matches;

        return {
            isSafe: !threats || threats.length === 0,
            threats: threats || [],
            error: false
        };
    } catch (err) {
        console.error("Error in Safe Browsing:", err.message);
        return { isSafe: false, threats: [], error: true };
    }
}

module.exports = isUrlSafe;
