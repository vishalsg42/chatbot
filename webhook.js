'use strict';
/*
* Set the const variables before testing the bot.
* 1. PAGE_ACCESS_TOKEN
* 2. APIAI_TOKEN
* 3. username
* 4. password
*/

// PAGE_ACCESS_TOKEN = 'facebook_page_access_token'
const PAGE_ACCESS_TOKEN = 'EAAEWKehLl14BACyrHkqqsUoUoZBylHsmg5Pf9B0A4BgB021QkaojpENup2SwpWSfRNHfulmccqG3CcFpNyAudzhWUIk7rQeQ6x0kTYlpWrdZBLyymemja4ZAxujh4mOVp7SthzihYQSYutGjhwtwqViRvp14XJeruO3xAxubgZDZD';

// APIAI_TOKEN = 'dialogflow_client_access_token'
const APIAI_TOKEN = '7266df4034974d5fa42d7c10b02fef32';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

const app = express();
const apiaiApp = apiai(APIAI_TOKEN);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// // Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

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
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'shopify-messenger-integration') {
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
    console.log("aiText Data===> "+aiText);

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient: { id: sender },
        message: { text: aiText }                
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
    const username = '8e68b0ada51356f5fe79a3bb660133de';
    // password = 'shopify_app_password'
    const password = 'ca1e7b2a49df493443c15f5b5201ee50';
    // shop = 'shop_name'
    const shop = 'internal-example-store';

    let restUrl = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/products.json';

    request.get(restUrl, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);

        // Get the name of all products
        let i, j, msg = "";

        // for (i in json.products) {
        //   msg += json.products[i].title + "\n";
        // }

        msg = [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [
                  {
                    "title": "Welcome!",
                    "image_url": "https://petersfancybrownhats.com/company_image.png",
                    "subtitle": "We have the right hat for everyone.",
                    "default_action": {
                      "type": "web_url",
                      "url": "https://petersfancybrownhats.com/view?item=103",
                      "webview_height_ratio": "tall",
                    },
                    "buttons": [
                      {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com",
                        "title": "View Website"
                      }, {
                        "type": "postback",
                        "title": "Start Chatting",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD"
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]

        console.log(msg)

        return res.send(
          JSON.stringify({
<<<<<<< HEAD
            fulfillmentText: "ABC",
            fulfillmentMessages: msg,
            source: 'Facebook'
=======
            fulfillmentMessages: msg,
            source: 'productList'
>>>>>>> 1eb463525dcb1fb9aa7118c22721b4cdbe067964
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