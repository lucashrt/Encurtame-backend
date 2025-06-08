require('dotenv').config();

const express = require('express');
const nanoid = require('nanoid');
const mongoose = require('mongoose');
const cors = require('cors');

const { Schema, model } = mongoose;
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const app = express();

app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri)

const urlSchema = new Schema ({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
})

const UrlModel = model('Url', urlSchema);

app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortUrl = nanoid.nanoid(8);
    const newUrl = new UrlModel({ originalUrl, shortUrl });

    try {
        await newUrl.save();
        res.status(201).json({ shortUrl: `${baseUrl}/${shortUrl}` });
    } catch (error) {
        res.status(500).json({ error: 'Error saving URL' });
    }
}
);

app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const url = await UrlModel.findOne({ shortUrl });

    if (!url) {
        return res.status(404).json({ error: 'URL not found' });
    }
    try {
        res.status(302).redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: 'Error redirecting to URL' });
    }
}
);

app.listen(port, function () {
    console.log(`Server is running`);
}
);