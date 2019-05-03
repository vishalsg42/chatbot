// const debug = require('debug')('Message Webhook');
const processMessage = require('./process-message');
const processPostbackMessage = require('./process-postback-message');
const dependencies = require("./controllers/dependencies").default;
const processShopify = require('./process-shopify');

module.exports = (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {        
        if (event.message && event.message.text)  {
					if (event.message.quick_reply !== undefined) {
            const payload = event.message.quick_reply.payload;
            processShopify.quickReplyPayload(payload);
          }
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
