// For sending requests to Facebook API
const fetch = require('node-fetch');

const config = require("./config")

// Dialogflow API
const dialogflow = require('dialogflow');

const languageCode = config.languageCode;

const creds = {
  credentials: {
    private_key: config.private_key,
    client_email: config.client_email
  },
};

const sessionClient = new dialogflow.SessionsClient(creds);

const sessionPath = sessionClient.sessionPath(config.projectId, config.sessionId);

let userId = null;
module.exports = (event) => {
  userId = event.sender.id;
  const message = event.message.text;
  let msg1 = '';

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
      let msg = result.fulfillmentText;
      msg1 = { "text": msg };
      return module.exports.sendTextMessage(msg1);
    })
    .catch((err) => {
      console.log(err);
    });

};


module.exports.sendTextMessage = (text) => {
  fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
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