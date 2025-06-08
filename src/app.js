require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/database');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

connectDB(mongoUri);

app.use(cors());
app.use(express.json());

app.use('/', urlRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
