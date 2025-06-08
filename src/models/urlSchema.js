const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const urlSchema = new Schema ({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
});

module.exports = model('Url', urlSchema);