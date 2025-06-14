require('dotenv').config();

const redis = require('./src/cache/redisClient.js');
const connectDB = require('./src/config/database.js');
const app = require('./app.js');

const port = process.env.PORT || 3000;

(async () => {
    try {
        connectDB(process.env.MONGODB_URI);
        await redis.connect();
        console.log('Redis connected');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Error connecting to Server:', err);
        process.exit(1);
    }
})();
