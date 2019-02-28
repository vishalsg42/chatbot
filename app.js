// Server Modules
const express = require('express');
const bodyParser = require('body-parser');

// Debug tools
// const debug = require('debug')('App');
// const chalk = require('chalk');

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
app.get('/ai', verifyWebhook);
app.post('/ai', messageWebhook);

// Dialogflow webhook
app.post('/webhook', handleAction);

app.listen(process.env.PORT || 8000, () => {
  console.log(`App is running on port 8000`)
  // debug(`App is running on ${chalk.green(8000)}`);
});
