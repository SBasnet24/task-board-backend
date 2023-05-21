const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const routes = require('./src/api/routes/index');
const globalErrorHandler = require('./src/api/errors/errorHandler');

const app = express();

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/api', routes);

app.use(globalErrorHandler);

module.exports = app;
