const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller');
const mongoose = require('mongoose');
const {ErrorHandler} = require ("./middleware/errorHandler");


let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use(ErrorHandler);

mongoose.connect("mongodb://localhost:27018/restaurant");

const port = process.env.PORT || 3456;

app.listen(port, () => console.log(`listening on port ${port}`));
