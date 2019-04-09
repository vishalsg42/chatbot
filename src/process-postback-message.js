// For sending requests to Facebook API
const fetch = require('node-fetch');

// Dialogflow API
const dialogflow = require('dialogflow');

const request = require('request');

const config = require("./config")
// debug(PAGE_ACCESS_TOKEN);

const languageCode = config.languageCode;

const creds = {
  credentials: {
    private_key: config.private_key,
    client_email: config.client_email
  },
};

const sessionClient = new dialogflow.SessionsClient(creds);

const sessionPath = sessionClient.sessionPath(config.projectId, config.sessionId);

let productApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json';

let collection_url = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/collects.json?collection_id=';

let collectionApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/custom_collections.json';

let userId = null;
module.exports = (event) => {
  userId = event.sender.id;
  let payload = event.postback.payload;

  if (payload === "get started") {
    request.get(collectionApi, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let headings = [];

        let json = JSON.parse(body);

        let i = "";

        let elements = {
          title: "",
          handle: ""
        }

        for (i in json.custom_collections) {
          elements.title = json.custom_collections[i].title;
          elements.handle = json.custom_collections[i].handle;

          headings.push(elements);
          elements = {
            title: "",
            handle: ""
          }
        }

        let contentMsg = []
        let content = {}

        for (i in headings) {
          content = {
            "content_type": "text",
            "title": headings[i].title,
            "payload": headings[i].handle
          }
          contentMsg.push(content);
          content = {};
        }

        let text = {
          "text": "What Product Do You Want To Shop For ?",
          "quick_replies": contentMsg
        }
        sendMessage(text);
      }
    });
  }

  if (payload === "all-products") {
    request.get(productApi, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);

        let i = "";
        let msg = [];
        let elements = {
          title: '',
          subtitle: '',
          img: '',
          productURL: ''
        };

        for (i in json.products) {
          elements.title = json.products[i].title;
          elements.subtitle = "Price : " + json.products[i].variants[0].price;
          elements.img = json.products[i].image.src;
          elements.productURL = json.products[i].handle;

          msg.push(elements);

          elements = {
            title: '',
            subtitle: '',
            img: '',
            productURL: ''
          };
        }
        const text = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": elements,
            }
          }
        }
        return sendMessage(text);
      }
    })
  }

  function sendMessage(text) {
    fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({
          messaging_type: 'RESPONSE',
          recipient: {
            id: userId,
          },
          message: text,
        }),
      }
    )
  }
}