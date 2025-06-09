const nanoid = require('nanoid');
const UrlModel = require('../models/urlSchema');

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