// Server Modules
const express = require('express');
const bodyParser = require('body-parser');

// Debug tools
const debug = require('debug')('App');
const chalk = require('chalk');

// Activating .env
require('dotenv').config();

// Facebook webhook
const { verifyWebhook } = require('./src/verify-webhook');
const messageWebhook = require('./src/message-webhook');

//  Dialogflow webhook
const { handleAction } = require('./src/handel-action');

const app = express();

// Application Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Facebook verification and messagepassing method call
app.get('/fbwebhook', verifyWebhook);
app.post('/fbwebhook', messageWebhook);

// Dialogflow webhook
app.post('/dialogflow', handleAction);

app.listen(8000, () => {
  debug(`App is running on ${chalk.green(8000)}`);
});
