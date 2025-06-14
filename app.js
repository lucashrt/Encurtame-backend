require('dotenv').config();

const express = require('express');
const cors = require('cors');

const Sentry = require('./src/sentry/instrument.js');
const urlRoutes = require('./src/routes/urlRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);
Sentry.setupExpressErrorHandler(app);

module.exports = app;