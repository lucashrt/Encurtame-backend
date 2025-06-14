const nanoid = require('nanoid');
const UrlModel = require('../models/urlSchema.js');
const Sentry = require('../sentry/instrument.js');
const isUrlSafe = require('../service/safeBrowsingservice.js');
const redisClient = require('../cache/redisClient.js');

const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    const urlCheck = await redisClient.get(originalUrl);
    if (urlCheck) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return res.status(200).json({ shortUrl: `${baseUrl}/${urlCheck}` });
    }

    const existingUrl = await UrlModel.findOne({ originalUrl }).lean();
    if (existingUrl) {
        await redisClient.set(originalUrl, existingUrl.shortUrl, { EX: 60 * 60 * 24 });
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return res.status(200).json({ shortUrl: `${baseUrl}/${existingUrl.shortUrl}` });
    }

    const { isSafe, threats, error } = await isUrlSafe(originalUrl);
    if (!isSafe) {
        return res.status(403).json({
            error: 'The provided URL is potentially malicious.',
            threats
        });
    }
    if (error) {
        Sentry.captureException(error);
        return res.status(503).json({ error: 'Error checking URL.' });
    }

    const shortUrl = nanoid.nanoid(8);
    const newUrl = new UrlModel({ originalUrl, shortUrl });

    try {
        await newUrl.save();
        await redisClient.set(originalUrl, shortUrl, { EX: 60 * 60 * 24 });
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        res.status(201).json({ shortUrl: `${baseUrl}/${shortUrl}` });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: 'Error saving URL' });
    }
};

const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await UrlModel.findOne({ shortUrl });
        if (!url) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            return res.status(404).redirect(`${baseUrl}/not-found`);
        }
        res.status(302).redirect(url.originalUrl);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: 'Error redirecting to URL' });
    }
};

module.exports = { shortenUrl, redirectUrl };