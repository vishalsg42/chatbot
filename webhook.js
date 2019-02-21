'use strict';
/*
* Set the const variables before testing the bot.
* 1. PAGE_ACCESS_TOKEN
* 2. APIAI_TOKEN
* 3. username
* 4. password
*/

// PAGE_ACCESS_TOKEN = 'facebook_page_access_token'
const PAGE_ACCESS_TOKEN = 'EAAfRcE3iHLoBAGCdLMrX4b7xZAaaD8hZCDZBiiQDd26Ls4vIOsuHgZAtkIFToyAJa2JkuvmSm7Lum9XUoSBQkY4hFWt61Aupors2FNTIn1k7Ar3NFCJdO0aO7Y7jZBiUgXtPcVZB0S5EDlZB2IoLyWOg2stLQVXdPuXgsIO0ZAcUowZDZD';

// APIAI_TOKEN = 'dialogflow_client_access_token'
const APIAI_TOKEN ='f861fe2330ed441491701a3869a43e7a';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const app = express();
const apiaiApp = apiai(APIAI_TOKEN);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// // Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())


const server = app.listen(process.env.PORT || 5000, () => {
 console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// webhook route
app.get('/', function (req, res) {
 res.send('Hello world, I am a chat bot')
})

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
 if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'FBVerificationToken') {
   res.status(200).send(req.query['hub.challenge']);
 } else {
   res.status(403).end();
 }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
 if (req.body.object === 'page') {
   req.body.entry.forEach((entry) => {
     entry.messaging.forEach((event) => {
       if (event.message && event.message.text) {
         sendMessage(event);
       }
     });
   });
   res.status(200).end();
 }
});

/* GET query from API.ai */

function sendMessage(event) {
 let sender = event.sender.id;
 let text = event.message.text;

 let apiai = apiaiApp.textRequest(text, {
   sessionId: 'shopify_bot'
 });

 apiai.on('response', (response) => {
   console.log(response)
   let aiText = response.result.fulfillment.speech;

   request({
     url: 'https://graph.facebook.com/v2.6/me/messages',
     qs: {access_token: PAGE_ACCESS_TOKEN},
     method: 'POST',
     json: {
       recipient: {id: sender},
       message: {text: aiText}
     }
   }, (error, response) => {
     if (error) {
       console.log('Error sending message: ', error);
     } else if (response.body.error) {
       console.log('Error: ', response.body.error);
     }
   });
 });

 apiai.on('error', (error) => {
   console.log(error);
 });

 apiai.end();
}

/* Webhook for API.ai to get response from the 3rd party API */
app.post('/ai', (req, res) => {
  /* Shopify API call for product */
  if (req.body.queryResult.action === 'productList') {
   console.log('*** product ***');

   // username = 'shopify_app_username'
   const username = 'a1e8fbc8a904bccb54d88f3a72977641';
   // password = 'shopify_app_password'
   const password = '2844a12c2b6703e12acee45778d0b7ae';
   // shop = 'shop_name'
   const shop = 'ankita-mestry';

   let restUrl = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/products.json';

   request.get(restUrl, (err, response, body) => {
     if (!err && response.statusCode == 200) {
       let json = JSON.parse(body);

       // Get the name of all products
       let i,j,msg = "";

       for (i in json.products) {
         msg += json.products[i].title + "\n";
       }

       return res.send(
         JSON.stringify({
           fulfillmentText: msg,
           source: 'productList'
         })
         );

     } else {
       let errorMessage = 'I failed to look up the product name.';
       return res.status(400).json({
         status: {
           code: 400,
           errorType: errorMessage
         }
       });
     }
   })
 }
});
