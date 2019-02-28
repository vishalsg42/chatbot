// For sending requests to Facebook API
const fetch = require('node-fetch');

// Dialogflow API
const dialogflow = require('dialogflow');

// Debug tools
// const debug = require('debug')('Process-Message');
// const chalk = require('chalk');

const responseFormat = require('./response-msgformat-fb');

const projectId = "agent-anonym";
const sessionId = '123456';
const languageCode = 'en-US';
const PAGE_ACCESS_TOKEN = 'EAAQ4elkZCrUgBAFVXMFL8f4xOltL4a65jq2pwskopXMjOHdpZAiDRrL3KC7ZB7Iw1YutkVcoOpHrg87OOZAVCB6oV4II3Rrky6XJTES9NqkiHx9HKVq4zqjsmXsDQh3ZB8ZAJTtACFYvc2mNTn2ZAZAlEXBzTE1tgmZCZCXqRXtZBEdBrvMf2G91IRj';

// debug(PAGE_ACCESS_TOKEN);

const config = {
  credentials: {
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtb/TnRq2j1Ryq\nbHnW0OyYzWl9FcEobM1F5g95K5HzQGi8MsGdpV6vLafS1gsCoZzYysFS9bGNNufG\nFxSH4q4PY4d4zlIwlgqn11aKgiIo2tMie42uZQw/NeeV0BmxdoyIO9KxD8vNs9+r\n0o3TtepwvqUn+dXva/o4JC+AmvQodSjzYu+dnvTB+mJty8MDMuMgllQBZqDxPEhG\nb3O0e7LAyktYtA0kWHedkSGNmxp/9pAGgHeNb/EyhxZ+qtywFhUBX2/SLaMDklnJ\nwEoarEHVP8M1+GyHJjADa9aLedQ/MnN+ephjo51ZCsHOusYuqaRYRfAV7RnFcevj\n1g5iKJVLAgMBAAECggEAQOo6FoRoQn1mDM2sLsClBa5AkP5e/TP4AvUQjpBFwO+3\nI9W1jT1TuqqSeYH+vf3ieGwvPs9SJOJLjuOdnhy0fHMKxicnMSM/msGpFQ+PHI6G\n3w2yoncUxeX1p6errjYKdIU7n2UjqXrtOWEGD5szw/4/T76dmc7m6TN2CiM1Rpyx\ntfaeQbSr3fZ3lSVG8n6xZtkI9sUgYKqlN0gStA4GmH9EQA0jrhn9lJMszPjQa3MD\nQhIgp7tWtCKjfbkhfOwOgylFYnU87FAqNGTWeAxgyRpqCRrO/9wbiisthzUt/UYy\nBrGi25hoDhIGyC3nmdeuLyPOQKDv94UJ3cLwzOrLSQKBgQDV0myBCb8bviXnHdrB\nI1gtKijtrh46kyLqylSs2q3BMwLcdaOUpx+FhQJdjKQjiztpd5g3zaihygn/RGIV\nWatbIK6MiUFB5MLUTjWXpn76+uHpTO5TMZkUU6R9iflczg6aW4f4s/87RWu2DUEr\nRnLWiv6Brac3CPuDSNByZ/edAwKBgQDPpjDA6DjlSWqhQK9TJSk9nAXHTXFUd1Av\nBHVix6iLCWUCjb4apHTT8x1ICIZSBCLK35uktQ4h4oHyk5EIcHnlZoZKh6fFifsy\nlzv/Xbwl1RbDG0bZJgMhHwH6No7x7e0h1R8pHu2VIb8A9l1kfogyfTIAUHSCZenO\nI2bZlGjAGQKBgDkWAeP9jyk//eyTWuj/n7YHMIAsYWOwDr1yoWK4y3TuQpBLVA4H\nBHJoTXZeayAWNxl0VY5oeOIhB8RAJJOgqhAdTJy2tFZ8VcvKyaIgUHx/aLsZz/Mk\nJcN4hU0C/jFZzipFz6qFm9neMeCb7083csd2unYyv5cA7e1iDkzNFx2zAoGBAI1J\nVwLq/0uDmLn/eUvpjRYOgyAI4YPHaxeSwQxlLZjs233RU/hszdEpKlNI+Zv0lHfV\njeGUD/meVSzom1ZSsZ4VFGrBwrX2HKVfocMv1EUpqEM43AwEgTyYDJBjbv/OE/th\nN8KS+LTwMTZGa2VlcuZnqQ3tsFjJXzyTefexs1SBAoGAXEEcXNeQTOIRetmkyKem\nIc90M/t36mAPBoVfj1wFCJcT0OZ/J9KlPI3xqLUeL6IlK6xVAcjejmsL0+EySnTc\nyos19YK5hLIH+eZnYqRfW1trXhPFzCHB83XVSsEhVbPkSz8VnUSfilrCWvHrwFdi\nfpoRA9KTTtgQuUK+fObepPk=\n-----END PRIVATE KEY-----\n",
    client_email: "dialogflow-oyywhs@agent-anonym.iam.gserviceaccount.com",
  },
};

// console.log('TCL: config', config);

const sessionClient = new dialogflow.SessionsClient(config);
// console.log('TCL: sessionClient', sessionClient)

const sessionPath = sessionClient.sessionPath(projectId, sessionId);
console.log('TCL: sessionPath', sessionPath);


var userId = null;
module.exports = (event) => {
  userId = event.sender.id;
  const message = event.message.text;
  let msg = '';
	console.log('TCL: message', message)

  // debug(chalk.red(message));

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode,
      },
    },
  };

  sessionClient
    .detectIntent(request)
    .then((responses) => {
      const result = responses[0].queryResult;
      // debug(chalk.yellow(result.fulfillmentText));
      msg = result.fulfillmentText;
      return exports.sendTextMessage(msg);
    })
    .catch((err) => {
      console.log(err);
      // debug(`Error: ${chalk.red(err)}`);
    });

};

exports.sendTextMessage = (text) => {
  fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        message: text,
      }),
    },
  );
};
