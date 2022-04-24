const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller');
const mongoose = require('mongoose');
const { ErrorHandler } = require('./middleware/errorHandler');
const { dbUrl, port } = require('../config');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(router);
app.use(ErrorHandler);

mongoose.connect(dbUrl);

const serverPort = port || 3456;

app.listen(port, () => console.log(`listening on port ${serverPort}`));
