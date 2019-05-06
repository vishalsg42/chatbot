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

// Shopify webhook
const orderPayment = require('./src/orderPayment');
const orderFulfillment = require('./src/orderFulfillment')

//  Dialogflow webhook
const { handleAction } = require('./src/handel-action');

const app = express();

// Application Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

// Facebook verification and messagepassing method call
app.get('/webhook', verifyWebhook);
app.post('/webhook', messageWebhook);

// Shopify webhooks 
app.post('/orderPayment', orderPayment);
app.post('/orderFulfillment', orderFulfillment);

// Dialogflow webhook
app.post('/ai', handleAction);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port 3000`)
  // debug(`App is running on ${chalk.green(3000)}`);
});
