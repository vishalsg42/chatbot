const {sendTextMessage} = require('./process-message');
const config = require('./config');
const moment = require("moment");
const striptags = require('striptags');
const request = require('request');

module.exports = (req, res) => {

  res.sendStatus(200);

  if (req.body) {
    let json = req.body;
    
    const msg = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `Item shipped for order ${json.name}
Shipping company: ${json.fulfillments[0].tracking_company}
Tracking Number: ${json.fulfillments[0].tracking_number}`,
          "buttons": [
            {
              "type": "web_url",
              "url": json.fulfillments[0].tracking_url,
              "title": "Tracking Link"
            }
          ]
        }
      }
    }
    
    return sendTextMessage(msg);
  }

}