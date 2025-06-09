const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const urlSchema = new Schema ({
    originalUrl: { type: String, required: true, unique: true, index: true },
    shortUrl: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, default: Date.now, expires: '30d' }
});

module.exports = model('Url', urlSchema);