require('dotenv').config();

const Sentry = require('./src/sentry/instrument.js');

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/database.js');
const urlRoutes = require('./src/routes/urlRoutes.js');

const app = express();

const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;

connectDB(mongoUri);

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
