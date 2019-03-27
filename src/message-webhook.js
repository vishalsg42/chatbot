// const debug = require('debug')('Message Webhook');
const processMessage = require('./process-message');
const processPostbackMessage = require('./process-postback-message');

module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {        
        if (event.message && event.message.text)  {          
          processMessage(event);
        }
        if (event.postback && event.postback.payload) {
          console.log(event.postback.payload)
          processPostbackMessage(event);
        }
      });
    });

    res.status(200).end();
  }
};
