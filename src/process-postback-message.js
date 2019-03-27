// For sending requests to Facebook API
const fetch = require('node-fetch');

// Dialogflow API
const dialogflow = require('dialogflow');

const request = require('request');

const projectId = "agent-anonym";
const sessionId = '123456';
const languageCode = 'en-US';
const PAGE_ACCESS_TOKEN = 'EAAQ4elkZCrUgBAHm0efKxkvp0uTw7OmKbJE8HggdqEIZBZA4UWyp8QIJyh79ZCrGM4NDcu22ZBbvEOa36wf0OgZBPd5cfz2Adri8AIFhEAK5TjZBSwnb0ZBvQwMSUn99tPSD0wpvT0v2Wfx6RkAyZByGvoCZCGZAP5Hj9euaW8BvyUZCMAZDZD';

// debug(PAGE_ACCESS_TOKEN);

const config = {
  credentials: {
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtb/TnRq2j1Ryq\nbHnW0OyYzWl9FcEobM1F5g95K5HzQGi8MsGdpV6vLafS1gsCoZzYysFS9bGNNufG\nFxSH4q4PY4d4zlIwlgqn11aKgiIo2tMie42uZQw/NeeV0BmxdoyIO9KxD8vNs9+r\n0o3TtepwvqUn+dXva/o4JC+AmvQodSjzYu+dnvTB+mJty8MDMuMgllQBZqDxPEhG\nb3O0e7LAyktYtA0kWHedkSGNmxp/9pAGgHeNb/EyhxZ+qtywFhUBX2/SLaMDklnJ\nwEoarEHVP8M1+GyHJjADa9aLedQ/MnN+ephjo51ZCsHOusYuqaRYRfAV7RnFcevj\n1g5iKJVLAgMBAAECggEAQOo6FoRoQn1mDM2sLsClBa5AkP5e/TP4AvUQjpBFwO+3\nI9W1jT1TuqqSeYH+vf3ieGwvPs9SJOJLjuOdnhy0fHMKxicnMSM/msGpFQ+PHI6G\n3w2yoncUxeX1p6errjYKdIU7n2UjqXrtOWEGD5szw/4/T76dmc7m6TN2CiM1Rpyx\ntfaeQbSr3fZ3lSVG8n6xZtkI9sUgYKqlN0gStA4GmH9EQA0jrhn9lJMszPjQa3MD\nQhIgp7tWtCKjfbkhfOwOgylFYnU87FAqNGTWeAxgyRpqCRrO/9wbiisthzUt/UYy\nBrGi25hoDhIGyC3nmdeuLyPOQKDv94UJ3cLwzOrLSQKBgQDV0myBCb8bviXnHdrB\nI1gtKijtrh46kyLqylSs2q3BMwLcdaOUpx+FhQJdjKQjiztpd5g3zaihygn/RGIV\nWatbIK6MiUFB5MLUTjWXpn76+uHpTO5TMZkUU6R9iflczg6aW4f4s/87RWu2DUEr\nRnLWiv6Brac3CPuDSNByZ/edAwKBgQDPpjDA6DjlSWqhQK9TJSk9nAXHTXFUd1Av\nBHVix6iLCWUCjb4apHTT8x1ICIZSBCLK35uktQ4h4oHyk5EIcHnlZoZKh6fFifsy\nlzv/Xbwl1RbDG0bZJgMhHwH6No7x7e0h1R8pHu2VIb8A9l1kfogyfTIAUHSCZenO\nI2bZlGjAGQKBgDkWAeP9jyk//eyTWuj/n7YHMIAsYWOwDr1yoWK4y3TuQpBLVA4H\nBHJoTXZeayAWNxl0VY5oeOIhB8RAJJOgqhAdTJy2tFZ8VcvKyaIgUHx/aLsZz/Mk\nJcN4hU0C/jFZzipFz6qFm9neMeCb7083csd2unYyv5cA7e1iDkzNFx2zAoGBAI1J\nVwLq/0uDmLn/eUvpjRYOgyAI4YPHaxeSwQxlLZjs233RU/hszdEpKlNI+Zv0lHfV\njeGUD/meVSzom1ZSsZ4VFGrBwrX2HKVfocMv1EUpqEM43AwEgTyYDJBjbv/OE/th\nN8KS+LTwMTZGa2VlcuZnqQ3tsFjJXzyTefexs1SBAoGAXEEcXNeQTOIRetmkyKem\nIc90M/t36mAPBoVfj1wFCJcT0OZ/J9KlPI3xqLUeL6IlK6xVAcjejmsL0+EySnTc\nyos19YK5hLIH+eZnYqRfW1trXhPFzCHB83XVSsEhVbPkSz8VnUSfilrCWvHrwFdi\nfpoRA9KTTtgQuUK+fObepPk=\n-----END PRIVATE KEY-----\n",
    client_email: "dialogflow-oyywhs@agent-anonym.iam.gserviceaccount.com",
  },
};

// console.log('TCL: config', config);

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

var userId = null;

const username = '43a8a24f406c63e004835ce1565fd01b';
const password = 'a895e46425a7067388c8f9c4e00e48d6';
const shop = "barista-shop1";

let productApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/products.json';

let collectionApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/custom_collections.json';

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
      `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
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