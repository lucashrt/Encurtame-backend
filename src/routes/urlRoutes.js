const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const urlController = require('../controllers/urlController.js');

const shortenLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 15,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/shorten', shortenLimiter, urlController.shortenUrl);
router.get('/:shortUrl', urlController.redirectUrl);

module.exports = router;