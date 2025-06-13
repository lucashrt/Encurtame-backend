const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController.js');

router.post('/shorten', urlController.shortenUrl);
router.get('/:shortUrl', urlController.redirectUrl);

module.exports = router;