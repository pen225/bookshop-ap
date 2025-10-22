const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// routes to mount later
module.exports = app;
