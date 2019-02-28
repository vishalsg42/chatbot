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
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC76qG/qYPUk71V\neVLKEGisuJsUbQrkJSNwXPUhdTIBnR0C6pKfolhoYPRioTmmVLRQGn7UChjdoBPp\nj5r5S+Nhx6RxHSbZou/YX2w3pAQ5l+Kzc+rCa2nn6zsritI8rfUXuzZJq+3CHueb\nJjy9uQFxv6bW9yRsMayHSGI3dOPzn/cfKkySlnuU350CGBhb+3Qmvzt+9hF5VHAy\nZElxYookKMeVVdZ+X038RC7jvMO7IGfvyN8NVaMBX4rW6nKUhoaj/ajfLabIGmBh\nlcxZbs/oCAXu+KrQqY0QdWtQlQERNo5CA/tHtwWT4WyyE5z/USbb6xfhhrAVNLf7\nrJwBFJA9AgMBAAECggEAAPOJ/sUP3UCUOHXvWzikUy2atr3RihOexn06oBBvw0W6\nh2kcUcF9L7BUhqMPUDwxqbv+C0yP8myQGWdhIYdw7Fl2ApklrtK8w/xbXRMRUD99\nBJ6iteqUiJNWRIdDhq/LpRGIBXJMWxmlyvUaay2f+NO1QbLm4aR1sh6sOwR7ahEZ\nP9gBEQznlEWaQFjfPvmSrx1RI+KeiDaE9QyS9DD4gMUJAZVH9qp1pVBSzPNslYxU\n9RgQA1Zl+ocX8nUP6f0wN8mL9rpEDLM6z4f/jYdUuCJJCo6qLw7nHiODzKnCu0kO\n0AsjgpbhPmtF7q8SEDhHd6kMhXHkr1gJQbtF3n5wJwKBgQDghIlh1UjUR5Zgbnoe\nKUIj/Qr8cLy5eEozgmpHTZ2MDeBST545quZLGgCMXooEBEhlAWRzh5XAFKalAA3Y\nRYUYAmDd0hDSKZWL3lr/eKChDXkU/XwIxKY0TSxEeYWa2y/Iz9kjw9PfOz+9IJ0J\nZa6N46n9OOZj1qIFw6z+6id5+wKBgQDWRDrzRwo5Xh73U36vy6eo6+YEsLznJBue\n93q5QC0VzjubRFqFrD4Nad9sou6PIAPtJvsrP54/cyPoHWjHDXLxps83U22uNGDx\nTszz6mK9bOk8rl5qnPmwgewBjuKO5nurZVWrmuthV+CzcaPs5Yb/6pmS9Io4/NEa\nMWrBxBUBJwKBgG6N9NQ+4Rjek1ayr+FQMahk/tblcJjneao5irnHp0+CubXuTJxa\n4gGTMTftiYqGzVsnP16AIiYuRQy0pRycxvfWm/o+aVgDcAcqm6Z2sKn9Z2UFmOD8\nbFcOtUCWkkp5qeL5LhQlZpviofUwLQOmlTh7JYZyUUhSNQAfpXz0sjGnAoGAQv/w\n4xOquceZrUL5kWUAV0z0jzDo0Oo0jN/cC0NrFa94ahPUronumWkqySClsjGTqLuQ\nvLRW+oY5iyJvGhc1gyTjFOzMljWgvrQiWH9JQuxkfmoT8giF91CZCN+yLncZ4r18\nLX3y7mx5QgNd+/zF2w5z2UUIV8uOYz9in5Z97u8CgYEAu3scRnzsKaXg0TYi6h8x\n7ypYyrZl+jlIaNKsGszjZtSg5iq+ZcXYkdtvpqX88aaOjjMFUP2nTm7sBCMdFS3s\nde/cNnNVsexMWPRhkGtCtHGz/lEcNV4VntXlszhBfsKyqIMNop4ncqnYd+zoMc/d\nBBpKAZZi63YzqAUGgNQpM0E=\n-----END PRIVATE KEY-----\n",
    client_email: "dialogflow - oyywhs@agent-anonym.iam.gserviceaccount.com",
  },
};

// console.log('TCL: config', config);

const sessionClient = new dialogflow.SessionsClient(config);
console.log('TCL: sessionClient', sessionClient)

const sessionPath = sessionClient.sessionPath(projectId, sessionId);
console.log('TCL: sessionPath', sessionPath)


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
