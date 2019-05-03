const fetch = require('node-fetch');
const dialogflow = require('dialogflow');
const request = require('request');
const config = require("./config");
const languageCode = config.languageCode;
const moment = require("moment")

const creds = {
  credentials: {
    private_key: config.private_key,
    client_email: config.client_email
  }
};

const sessionClient = new dialogflow.SessionsClient(creds);
const sessionPath = sessionClient.sessionPath(config.projectId, config.sessionId);

let productApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json';
let collection_url = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/collects.json?collection_id=';
let collectionApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/custom_collections.json';

let userId = null;

module.exports = (event) => {
  userId = event.sender.id;
  let payload = event.postback.payload;

  const sendTextMessage = async(text) => {
    await fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          messaging_type: 'RESPONSE',
          recipient: {
            id: userId,
          },
          sender_action: 'typing_on', 
        })
      }
    );
    
    await fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
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
  
    await fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          messaging_type: 'RESPONSE',
          recipient: {
            id: userId,
          },
          sender_action: 'typing_off', 
        })
      }
    );
  };

  if (payload == "get started") {
    const msg = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Hey, How can i help you with ?",
          "buttons": [
            {
              "type":"web_url",
              "url":config.shopUrl,
              "title":"View Shop",
              "webview_height_ratio": "full"
            },
            {
              "type": "postback",
              "title": "View Products",
              "payload": "products collection"
            },
            {
              "type": "postback",
              "title": "Learn More",
              "payload": "learn more"
            }
          ]
        }
      }
    }

    return sendTextMessage(msg);
  }

  if (payload == "learn more") {
    const msg = {
      "text": "Hey, You can view all our products here and even buy them directly from here !!!"
    }

    return sendTextMessage(msg);
  }

  if (payload === "products collection") {
    request.get(collectionApi, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let headings = [];

        let json = JSON.parse(body);

        let i = "";

        let elements = {
          title: "",
          handle: ""
        }

        for (i in json.custom_collections) {
          elements.title = json.custom_collections[i].title;
          elements.handle = json.custom_collections[i].handle;

          headings.push(elements);
          elements = {
            title: "",
            handle: ""
          }
        }

        let contentMsg = []
        let content = {}

        for (i in headings) {
          content = {
            "content_type": "text",
            "title": headings[i].title,
            "payload": headings[i].handle
          }
          contentMsg.push(content);
          content = {};
        }

        let text = {
          "text": "What Product Do You Want To Shop For ?",
          "quick_replies": contentMsg
        }
        sendTextMessage(text);
      }
    });
  }

  if (payload === "all-products") {
    request.get(productApi, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);

        let i = "";
        let msg = [];
        let elements = {
          title: '',
          subtitle: '',
          img: '',
          productURL: ''
        };

        for (i in json.products) {
          elements.title = json.products[i].title;
          elements.subtitle = "Price : " + json.products[i].variants[0].price;
          elements.img = json.products[i].image.src;
          elements.productURL = json.products[i].handle;

          msg.push(elements);

          elements = {
            title: '',
            subtitle: '',
            img: '',
            productURL: ''
          };
        }
        const text = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": elements,
            }
          }
        }
        return sendTextMessage(text);
      }
    })
  }
  
  if (payload.trim().replace(/[0-9]/g,"").trim() === "shoes") {
    const payloadId = payload.trim().replace(/[^0-9]/g,"").trim()
    const shoesId = [];

    const promise = new Promise((resolve, reject) => {
      request.get('https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json', (err, res, body) => {
        if (!err && res.statusCode == 200) {
          let json = JSON.parse(body);
  
          let id = [];
          
          for (i=0; i<json.products.length; i++) {
            if(json.products[i].product_type == "shoes") {
              shoesId.push(json.products[i].id);
            }
          }
          resolve(id);
        }
      });
    })

    promise.then(res => {
      shoesId.push(res);
    })

    request.get('https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products/'+payloadId+'/variants.json', (err, res, body) => {
      if (!err && res.statusCode == 200) {
        let json = JSON.parse(body);
        const sizes = [];
        
        json.variants.forEach(elements => {
          sizes.push(elements.option1);
        })
        
        const newSizes = [...new Set(sizes)];
        const headings = []
        
        newSizes.forEach(i => {
          elements = {
            "content_type": "text",
            "title": i,
            "payload": i +"shoes" + payloadId
          }
          headings.push(elements);
        })
        
        const text = {
          "text": "Please select a size ?",
          "quick_replies": headings
        }
        return sendTextMessage(text);
      }
    })
  }

  if (payload === "order") {
    request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/orders.json?ids=1024349044796', (err, res, body) => {
      if (!err && res.statusCode == 200) {
        let json = JSON.parse(body);

        const text = {
          "attachment": {
            "type": "template",
            "payload":{
              "template_type":"receipt",
              "recipient_name":json.orders[0].customer.first_name + "" + json.orders[0].customer.last_name,
              "order_number":json.orders[0].name,
              "currency":json.orders[0].currency,
              "payment_method": json.orders[0].gateway,        
              "order_url":json.orders[0].order_status_url,
              "timestamp":moment(json.orders[0].created_at).unix(),         
              "address":{
                "street_1":json.orders[0].shipping_address.address1,
                "city":json.orders[0].shipping_address.city,
                "postal_code":json.orders[0].shipping_address.zip,
                "state":json.orders[0].shipping_address.province,
                "country":json.orders[0].shipping_address.country
              },
              "summary":{
                "subtotal":json.orders[0].subtotal_price,
                "shipping_cost":json.orders[0].total_shipping_price_set.shop_money.amount,
                "total_tax":json.orders[0].total_tax,
                "total_cost":json.orders[0].total_price
              },
              "elements":[
                {
                  "title":json.order[0].line_items[0].title,
                  "subtitle":"100% Soft and Luxurious Cotton",
                  "quantity":2,
                  "price":50,
                  "currency":"USD",
                  "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
                }
              ]
            }
          }
        }

        return sendTextMessage(text);
      }
    });
  }

  // if (payload === "8") {
  //   request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products/3482922844232/variants.json', (err, res, body) => {
  //     if(!err && res.statusCode == 200) {
  //       let json = JSON.parse(body);
  //       const colors = [];
        
  //       json.variants.forEach(elements => {
  //         colors.push(elements.option2);
  //       })

  //       const newColors = [...new Set(colors)];

  //       const headings = []
        
  //       newColors.forEach(i => {
  //         console.log("Example: i", i);
  //         elements = {
  //           "type": "postback",
  //           "title": i,
  //           "payload": i
  //         }
  //         headings.push(elements);
  //       })
        
  //       const text = {
  //         "attachment": {
  //           "type": "template",
  //           "payload": {
  //             "template_type": "button",
  //             "text": "This shoe is available in this particular color, what color do you prefer ?",
  //             "buttons": headings
  //           }
  //         }
  //       }
  //       return sendTextMessage(text);
  //     }
  //   })
  // }

  // const sendTextMessage = async(text) => {
  //   await fetch(
  //     `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         messaging_type: 'RESPONSE',
  //         recipient: {
  //           id: userId,
  //         },
  //         sender_action: 'typing_on', 
  //       })
  //     }
  //   );
    
  //   await fetch(
  //     `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         messaging_type: 'RESPONSE',
  //         recipient: {
  //           id: userId,
  //         },
  //         message: text,
  //       }),
  //     },
  //   );
  
  //   await fetch(
  //     `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         messaging_type: 'RESPONSE',
  //         recipient: {
  //           id: userId,
  //         },
  //         sender_action: 'typing_off', 
  //       })
  //     }
  //   );
  // };
}
