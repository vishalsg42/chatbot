const sendMessage = require('./process-message');


module.exports.responseFormat = (msg,datafetch) => {
  let elements =[];
  // debug(`message is ${msg} for this ${datafetch}`);
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
          "url": "",
          "messenger_extensions": true,
          "webview_height_ratio": "tall",
        },
        "buttons": [
          {
            "type": "web_url",
            "url": '',
            "title": "View product"
          }
        ]
      }
      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = "https://barista-shop1.myshopify.com/products/" + msg[i].productURL;
      items.buttons[0].url = 'https://barista-shop1.myshopify.com/products/' + msg[i].productURL;

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
            "messenger_extensions": true,
            "webview_height_ratio": "COMPACT",
            "fallback_url": "https://barista-shop1.myshopify.com/"
          }
        ],
        "default_action": {
          "type": "web_url",
          "url": "",
          "messenger_extensions": true,
          "webview_height_ratio": "COMPACT"
        },
      }
      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = "https://barista-shop1.myshopify.com/products/" + msg[i].productURL;
      items.buttons[0].url = 'https://barista-shop1.myshopify.com/products/' + msg[i].productURL;

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

  if (datafetch == 'productList') {         
    productscarousel();        
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
  if (datafetch == 'Headphones') {
    productscarousel();
  }
  if (datafetch == 'Sunglass') {
    productscarousel();
  }
  if (datafetch == 'Tablets') {
    productscarousel();
  }
  if (datafetch == 'Books') {
    productscarousel();
  }
  if (datafetch == 'Mobiles') {
    productscarousel();
  }
  if (datafetch == 'Shoes') {
    productscarousel();
  }
  if (datafetch == 'Bags') {
    productscarousel();
  }
  if (datafetch == 'Laptop') {
    productscarousel();
  }
}