const sendMessage = require('./process-message');
// const debug = require('debug')('Response message format for FBmessenger');


module.exports.responseFormat = (msg,datafetch) => {
  let elements =[];
  // debug(`message is ${msg} for this ${datafetch}`);
  if (datafetch == 'productList'){ 

    let l='';
    l= msg.length;

    for (let i = 0; i<l; i++ ) {

      let items =  {
        "title":"",
        "subtitle":"",
        "image_url":"",
        "default_action": {
          "type": "web_url",
          "url": "",
          "webview_height_ratio": "tall",
        },
        "buttons":[
          {
            "type":"web_url",
            "url":'',
            "title":"View product"
          }          
        ]      
      }

      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = "https://internal-example-store.myshopify.com/products/" + msg[i].productURL;
      items.buttons[0].url = 'https://internal-example-store.myshopify.com/products/' + msg[i].productURL;

      elements.push(items);
    }

    const message = { 
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements": elements,
        }
      }
    };
    
    // debug("message pass is" , message)
    return sendMessage.sendTextMessage(message);
  }
  if (datafetch == 'productListCard') {

    let l = '';
    l = msg.length;

    for (let i = 0; i < l; i++) {

      let items = {
        "title": "",
        "subtitle": "",
        "image_url": "",
        "default_action": {
          "type": "web_url",
          "url": "",
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
      items.default_action.url = "https://internal-example-store.myshopify.com/products/" + msg[i].productURL;
      items.buttons[0].url = 'https://internal-example-store.myshopify.com/products/' + msg[i].productURL;

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

    // debug("message pass is" , message)
    return sendMessage.sendTextMessage(message);
  }
  if (datafetch == 'productImages') {

    imageurl = msg;
    
    const message = {
      "attachment": {
        "type": "image",
        "payload": {
          "url": imageurl
        }
      }
    };

    // debug("message pass is" , message)
    return sendMessage.sendTextMessage(message);
  }
  if (datafetch == 'productVideos') {

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

    // debug("message pass is" , message)
    return sendMessage.sendTextMessage(message);
  }
}