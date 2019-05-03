const config = require("../config")
const dialogflow = require('dialogflow');
const languageCode = config.languageCode;
const dependencies = require("./dependencies").default;

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
      return dependencies.messengerRes.sendTextMessage(msg1, userId);
    })
    .catch((err) => {
      console.log(err);
    });
};