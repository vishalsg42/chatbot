const {sendTextMessage} = require('./process-message');
const config = require('./config');
const moment = require("moment");
const striptags = require('striptags');
const request = require('request');

module.exports = (req, res) => {
  
  res.sendStatus(200);

  if (req.body) {
    let json = req.body;

    const promise = new Promise((resolve, reject) => {
      
      const receiptElements = [];

      let elements1 = {
        title:"",
        productId:"",
        quantity:"",
        price:"",
        currency:""
      };

      for (i in json.line_items) {
        elements1.title = json.line_items[i].title;
        elements1.productId = json.line_items[i].product_id;
        elements1.quantity = json.line_items[i].quantity;
        elements1.price = json.line_items[i].price;
        elements1.currency = json.line_items[i].price_set.shop_money.currency_code;

        receiptElements.push(elements1);

        elements1 = {
          title:"",
          productId:"",
          quantity:"",
          price:"",
          currency:""
        }
        
      }

      const y = [];

      for (i in receiptElements) {
        let x = {
          "title":receiptElements[i].title,
          "productId":receiptElements[i].productId,
          "quantity":receiptElements[i].quantity,
          "price":receiptElements[i].price,
          "currency":receiptElements[i].currency
        }

        y.push(x);
        
        x = {
          "title":"",
          "productId":"",
          "quantity":"",
          "price":"",
          "currency":""
        }

      }

      const textMsg = {
        "recipient_name":json.customer.first_name + " " + json.customer.last_name,
        "order_number":json.name,
        "currency":json.currency,
        "payment_method": json.gateway,        
        "order_url":json.order_status_url,
        "timestamp":moment(json.created_at).unix(),
        "street_1":json.shipping_address.address1,
        "city":json.shipping_address.city,
        "postal_code":json.shipping_address.zip,
        "state":json.shipping_address.province,
        "country":json.shipping_address.country,
        "subtotal":json.subtotal_price,
        "shipping_cost":json.total_shipping_price_set.shop_money.amount,
        "total_tax":json.total_tax,
        "total_cost":json.total_price,
        y
      }

      resolve(textMsg);
    });
  
    promise.then(data => {
      const material = [];
      for (i=0 ; i< data.y.length; i++) {
        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?ids='+data.y[i].productId, (err, res, body) => {
          let json = JSON.parse(body);
          

          let elements = {
            description: "",
            imageUrl: ""
          }

          for (i in json.products) {
            elements.description = striptags(json.products[i].body_html);
            elements.imageUrl = json.products[i].image.src;

            material.push(elements);

            elements = {
              description: "",
              imageUrl: ""
            }
          }

          for (z in data.y) {
            const text = {
              "attachment": {
                "type": "template",
                "payload":{
                  "template_type":"receipt",
                  "recipient_name":data.recipient_name,
                  "order_number":data.order_number,
                  "currency":data.currency,
                  "payment_method":data.payment_method,        
                  "order_url":data.order_url,
                  "timestamp":data.timestamp,         
                  "address":{
                    "street_1":data.street_1,
                    "city":data.city,
                    "postal_code":data.postal_code,
                    "state":data.state,
                    "country":data.country
                  },
                  "summary":{
                    "subtotal":data.subtotal,
                    "shipping_cost":data.shipping_cost,
                    "total_tax":data.total_tax,
                    "total_cost":data.total_cost
                  },
                  "elements":[
                    {
                      "title":data.y[z].title,
                      "subtitle":material[z].description,
                      "quantity":data.y[z].quantity,
                      "price":data.y[z].price,
                      "currency":data.y[z].currency,
                      "image_url":material[z].imageUrl
                    }
                  ]
                }
              }
            }

						console.log("Example: text", text.attachment.payload.elements)
            return sendTextMessage(text);
          }
        })
      }

      // request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?ids='+data.productId, (err, res, body) => {
      //   if (!err && res.statusCode == 200) {
      //     let json = JSON.parse(body);

      //     const description = striptags(json.products[0].body_html);
      //     const imageUrl = json.products[0].image.src;

      //     const text = {
      //       "attachment": {
      //         "type": "template",
      //         "payload":{
      //           "template_type":"receipt",
      //           "recipient_name":data.recipient_name,
      //           "order_number":data.order_number,
      //           "currency":data.currency,
      //           "payment_method":data.payment_method,        
      //           "order_url":data.order_url,
      //           "timestamp":data.timestamp,         
      //           "address":{
      //             "street_1":data.street_1,
      //             "city":data.city,
      //             "postal_code":data.postal_code,
      //             "state":data.state,
      //             "country":data.country
      //           },
      //           "summary":{
      //             "subtotal":data.subtotal,
      //             "shipping_cost":data.shipping_cost,
      //             "total_tax":data.total_tax,
      //             "total_cost":data.total_cost
      //           },
      //           "elements":[
      //             {
      //               "title":data.title,
      //               "subtitle":description,
      //               "quantity":data.quantity,
      //               "price":data.price,
      //               "currency":data.currency,
      //               "image_url":imageUrl
      //             }
      //           ]
      //         }
      //       }
      //     }
      //     return sendTextMessage(text);
      //   }
      // });
    });
  }

}