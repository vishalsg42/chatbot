// const debug = require('debug')('Message Webhook');
const processMessage = require('./process-message');

module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        console.log(event);
        if (event.message && event.message.text) {
          console.log("Message webhook Passed");
          processMessage(event);
        }
      });
    });

    res.status(200).end();
  }
};
