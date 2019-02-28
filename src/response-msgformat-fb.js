const sendMessage = require('./process-message');
// const debug = require('debug')('Response message format for FBmessenger');

let elements =[];

module.exports.responseFormat = (msg,datafetch) => {
  // debug(`message is ${msg} for this ${datafetch}`);
  console.log(`message is ${msg} for this ${datafetch}`);
  if(datafetch == 'productList'){ 

    let l='';
    l= msg.length;

    for (let i = 0; i<l; i++ ) {

      let items =  {
        "title":"",
        "image_url":"",
        "subtitle":"",
        "default_action": {
          "type": "web_url",
          "url": "",
          "webview_height_ratio": "tall",
        },
        "buttons":[
          {
            "type":"web_url",
            "url":'https://websitestorebot.myshopify.com/products/',
            "title":"View product"
          }          
        ]      
      }

      items.title = msg[i].title;
      items.subtitle = msg[i].subtitle;
      items.image_url = msg[i].img;
      items.default_action.url = "https://websitestorebot.myshopify.com/products/"+msg[i].title;

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
}