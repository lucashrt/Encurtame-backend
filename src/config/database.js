const mongoose = require('mongoose');

const connectDB = (mongoUri) => {
    mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = connectDB;