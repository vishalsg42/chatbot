const sendMessage = require('./process-message');
const config = require('./config');

module.exports.responseFormat = (msg, datafetch) => {
  let elements = [];
  let l = '';
  function productscarousel() {
    l = msg.length;
    for (let i = 0; i < l; i++) {
      let items = {
        "title": "",
        "subtitle": "",
        "image_url": "",
        "default_action": {
          "type": "web_url",
          "url": ""
        },
        "buttons": [
          {
            "type": "web_url",
            "url": "",
            "title": "View product"
          },
          {
            "type": "web_url",
            "url": "",
            "title": "Buy product"          
          },
          {
            "type": "element_share",
            "share_contents": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [
                    {
                      "title": "I took the hat quiz",
                      "subtitle": "My result: Fez",
                      "image_url": "https://bot.peters-hats.com/img/hats/fez.jpg",
                      "default_action": {
                        "type": "web_url",
                        "url": "http://m.me/petershats?ref=invited_by_24601"
                      },
                      "buttons": [
                        {
                          "type": "web_url",
                          "url": "http://m.me/petershats?ref=invited_by_24601", 
                          "title": "Take Quiz"
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        ]
      }
      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;
      items.buttons[0].url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;
      items.buttons[1].url = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/cart/' + msg[i].variantId + ':1';

      elements.push(items);
    }
    const message = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": elements,
        }
      }
    };
    return sendMessage.sendTextMessage(message);
  }

  function productscard() {
    l = msg.length;
    for (let i = 0; i < 4; i++) {
      let items = {
        "title": "",
        "subtitle": "",
        "image_url": "",
        "buttons": [
          {
            "title": "View",
            "type": "web_url",
            "url": "",
            "fallback_url": `https://${config.shop}.myshopify.com/`
          }
        ],
        "default_action": {
          "type": "web_url",
          "url": ""
        },
      }
      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;
      items.buttons[0].url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;

      elements.push(items);
    }
    const message = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": elements,
          "buttons": [
            {
              "title": "View More",
              "type": "postback",
              "payload": "card"
            }
          ]
        }
      }
    };
    return sendMessage.sendTextMessage(message);
  }

  function displayImage() {
    imageurl = msg;
    const message = {
      "attachment": {
        "type": "image",
        "payload": {
          "url": imageurl
        }
      }
    };
    return sendMessage.sendTextMessage(message);
  }

  function displayVideo() {
    elements = msg;
    console.log('TCL: module.exports.responseFormat -> elements', elements)
    const message = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "open_graph",
          "elements": [
            {
              "url": elements
            }
          ]
        }
      }
    };
    return sendMessage.sendTextMessage(message);
  }
  
  if (datafetch == 'productListCard') {
    productscard();
  }
  if (datafetch == 'productImages') {
    displayImage();
  }
  if (datafetch == 'productVideos') {
    displayVideo();
  }
  if (datafetch == 'productList' || datafetch == 'Headphones' || datafetch == 'Sunglass' || datafetch == 'Tablets' || datafetch == 'Books' || datafetch == 'Mobiles' || datafetch == 'Bags' || datafetch == 'Laptop') {
    productscarousel();
  }
  if (datafetch == 'Shoes') {
      l = msg.length;
      for (let i = 0; i < l; i++) {
        let items = {
          "title": "",
          "subtitle": "",
          "image_url": "",
          "default_action": {
            "type": "web_url",
            "url": ""
          },
          "buttons": [
            {
              "type": "postback",
              "title": "View product",
              "payload": ""
            }
          ]
        }
        items.title = msg[i].title;
        items.subtitle = msg[i].subtitle;
        items.image_url = msg[i].img;
        items.default_action.url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;
        // items.buttons[0].url = `https://${config.shop}.myshopify.com/products/` + msg[i].productURL;
        items.buttons[0].payload = "shoes " + msg[i].productID;

        elements.push(items);
      }
      const message = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": elements,
          }
        }
      };
      return sendMessage.sendTextMessage(message);
  }
}