// For sending requests to Facebook API
const fetch = require('node-fetch');

// Dialogflow API
const dialogflow = require('dialogflow');

// Debug tools
// const debug = require('debug')('Process-Message');
// const chalk = require('chalk');

const responseFormat = require('./response-msgformat-fb');

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionId = '123456';
const languageCode = 'en-US';
const { PAGE_ACCESS_TOKEN } = process.env;

// debug(PAGE_ACCESS_TOKEN);

const config = {
  credentials: {
    private_key: JSON.parse(process.env.PRIVATE_KEY),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
  },
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);


var userId = null;
module.exports = (event) => {
  userId = event.sender.id;
  const message = event.message.text;
  let msg = '';

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
