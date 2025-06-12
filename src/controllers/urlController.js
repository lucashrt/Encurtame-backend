const nanoid = require('nanoid');
const UrlModel = require('../models/urlSchema');
const isUrlSafe = require('../service/safeBrowsingservice');

const shortenUrl = async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    const existingUrl = await UrlModel.findOne({ originalUrl }).lean();
    if (existingUrl) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return res.status(200).json({ shortUrl: `${baseUrl}/${existingUrl.shortUrl}` });
    }

    const { isSafe, threats, error } = await isUrlSafe(originalUrl);

    if (error) {
        return res.status(503).json({ error: 'Error checking URL.' });
    }

    if (!isSafe) {
        return res.status(403).json({
            error: 'The provided URL is potentially malicious.',
            threats
        });
    }

    const shortUrl = nanoid.nanoid(8);
    const newUrl = new UrlModel({ originalUrl, shortUrl });

    try {
        await newUrl.save();
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        res.status(201).json({ shortUrl: `${baseUrl}/${shortUrl}` });
    } catch (error) {
        res.status(500).json({ error: 'Error saving URL' });
    }
};

const redirectUrl = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await UrlModel.findOne({ shortUrl });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.status(302).redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Error redirecting to URL' });
    }
};

module.exports = { shortenUrl, redirectUrl };