const responseFormat = require('./response-msgformat-fb');
const postbackId = require('./process-postback-message');
const request = require('request');
const config = require('./config');
const fetch = require('node-fetch');
const collectionIds = require("./collectionId");
const processMessage = require("./process-message");

const productApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json';

// const collection_url = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/collects.json?collection_id=';

const custom = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections.json`;
// const customCollectionsId = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections/`;
// const collects = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/collects.json?collection_id=129112899656`;

const productApi1 = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json?collection_id=129112899656';

const allCollectionsId = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections.json?fields=id,handle`;

const url = [];

const p = new Promise((resolve, reject) => {
  
  request.get(allCollectionsId, (err, res, body) => {
    let json = JSON.parse(body);

    const URLS = [];
    
    json.custom_collections.forEach(elements => {
      URLS.push(elements.handle+':'+elements.id);
    })

    // switch(json.custom_collections[0].handle) {
    //   case "bags":
    //     const bagsid = json.custom_collections[0].id;
    //     const bagsUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+bagsid;
    //     URLS.pushl(bagsUrl);
    //     break;

    //   case "books":
    //     const booksid = json.custom_collections[0].id;
    //     const booksUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+booksid;
    //     URLS.push(booksUrl);
    //     break;
      
    //   case "headphones":
    //     const headphonesid = json.custom_collections[0].id;
    //     const headphonesUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+headphonesid;
    //     URLS.push(headphonesUrl);
    //     break;

    //   case "laptops":
    //     const laptopsid = json.custom_collections[0].id;
    //     const laptopsUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+laptopsid;
    //     URLS.push(laptopsUrl);
    //     break;

    //   case "mobiles":
    //     const mobilesid = json.custom_collections[0].id;
    //     const mobilesUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+mobilesid;
    //     URLS.push(mobilesUrl);
    //     break;
      
    //   case "shoes":
    //     const shoesid = json.custom_collections[0].id;
    //     const shoesUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+shoesid;
    //     URLS.push(shoesUrl);
    //     break;

    //   case "sunglass":
    //     const sunglassid = json.custom_collections[0].id;
    //     const sunglassUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+sunglassid;
    //     URLS.push(sunglassUrl);
    //     break;
      
    //   case "tablets":
    //     const tabletsid = json.custom_collections[0].id;
    //     const tabletsUrl = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+tabletsid;
    //     URLS.push(tabletsUrl);
    //     break;

    //   case "top-10-products":
    //     const top10id = json.custom_collections[0].id;
    //     const top10Url = 'https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+top10id;
    //     URLS.push(top10Url);
    //     break;

    //   default:
    //     err;
    // }

    resolve(URLS);
  })
})

p.then(data => {
  url.push(data);
})

// exports.quickReplyPayload = (payload) => {
// 	console.log("Example: exports.quickReplyPayload -> payload", payload);
// }

const payload = {
  id: ""
};

module.exports = {
  quickReplyPayload: (data) => {
		console.log("Example: data", data)
    payload.id = data;
  },
  datafetch : (datafetch) => {
  console.log("Example: datafetch", datafetch)

  // const payload = methods.call(quickReplyPayload);
  // console.log("Example: payload -> data", payload)

    let json;
    let i;
    let msg;
    let elements;
    
    switch(datafetch) {
      case "productList":
        const top10URL = url[0][8];
        const top10URLID = top10URL.replace(/.{4,}[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+top10URLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          console.log("Example: msg", msg);
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;
      
      case "productListCard":
        request.get(productApi, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "productVideos":
        msg = "https://www.youtube.com/watch?v=E4n7BQkOQ_s";
        responseFormat.responseFormat(msg, datafetch);
        break;

      case "productImages":
        msg = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
        responseFormat.responseFormat(msg, datafetch);
        break;

      case "Headphones":
        const headphonesURL = url[0][2];
				console.log("Example: headphonesURL", headphonesURL)
        const headphonesURLID = headphonesURL.replace(/[^0-9]/g, '');
				console.log("Example: headphonesURLID", headphonesURLID)

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+headphonesURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
					console.log("Example: msg", msg)
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Sunglass":
        const sunglassURL = url[0][3];
        const sunglassURLID = sunglassURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+sunglassURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Tablets":
        const tabletsURL = url[0][7];
        const tabletsURLID = tabletsURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+tabletsURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Mobiles":
        const mobilesURL = url[0][4];
        const mobilesURLID = mobilesURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+mobilesURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Books":
        const booksURL = url[0][1];
        const booksURLID = booksURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+booksURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
            title: '',
            subtitle: '',
            img: '',
            productURL: '',
            variantId: ''
          };

          for (i in json.products) {
            elements.title = json.products[i].title;
            elements.subtitle = "Price : " + json.products[i].variants[0].price;
            elements.img = json.products[i].image.src;
            elements.productURL = json.products[i].handle;
            elements.variantId = json.products[i].variants[0].id;

            msg.push(elements);
            
            elements = {
              title: '',
              subtitle: '',
              img: '',
              productURL: '',
              variantId: ''
            };
          }
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Bags":
        const bagsURL = url[0][0];
        const bagsURLID = bagsURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+bagsURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Laptop":
        const laptopURL = url[0][3];
        const laptopURLID = laptopURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+laptopURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
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
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Shoes":
        const shoesURL = url[0][5];
        const shoesURLID = shoesURL.replace(/[^0-9]/g, '');

        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products.json?collection_id='+shoesURLID, (err, res, body) => {
          if(!err && res.statusCode == 200 && datafetch) {
          json = JSON.parse(body);

          // Get the name of all products
          i = "";
          msg = [];
          elements = {
            title: '',
            subtitle: '',
            img: '',
            productURL: '',
            productID: ''
          };

          for (i in json.products) {
            elements.title = json.products[i].title;
            elements.subtitle = "Price : " + json.products[i].variants[0].price;
            elements.img = json.products[i].image.src;
            elements.productURL = json.products[i].handle;
            elements.productID = json.products[i].id;

            msg.push(elements);
            
            elements = {
              title: '',
              subtitle: '',
              img: '',
              productURL: '',
              productID: ''
            };
          }
          responseFormat.responseFormat(msg, datafetch);
        }
        })
        break;

      case "Size":
      // const payloadId = payload.trim().replace(/[^0-9]/g,"").trim()
      // const shoesId = [];

      // const promise = new Promise((resolve, reject) => {
      //   request.get('https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json', (err, res, body) => {
      //     if (!err && res.statusCode == 200) {
      //       let json = JSON.parse(body);
    
      //       let id = [];
            
      //       for (i=0; i<json.products.length; i++) {
      //         if(json.products[i].product_type == "shoes") {
      //           shoesId.push(json.products[i].id);
      //         }
      //       }
      //       resolve(id);
      //     }
      //   });
      // })

      // promise.then(res => {
      //   shoesId.push(res);
      // })

      const payloadId = payload.id.replace(/^\d*[a-zA-Z]*/g, "");

      request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products/'+payloadId+'.json', (err, res, body) => {
        if(!err && res.statusCode == 200) {
          let json = JSON.parse(body);
          const colors = [];
          const options = json.product.options;
          const optionsId = []
          
          options.forEach(i => {
            if(i.name == "Color") {
              optionsId.push(i.id);
              colors.push((i.values));
            }
          })

          if (optionsId.length == 0) {
            const noColor = {
              "text": "There is no color options available !!!"
            }
            processMessage.sendTextMessage(noColor);
          }

          const color = [].concat.apply([], colors);

          const headings = []
          
          color.forEach(i => {
            elements = {
              "content_type": "text",
              "title": i,
              "payload": payload.id + i
            }
            headings.push(elements);
          })
          
          const text = {
            "text": "What color are you looking for ?",
            "quick_replies": headings
          }
          processMessage.sendTextMessage(text);
        }
      })
      break;

      case "Color":
        const payloadIds = payload.id.replace(/^\d*[a-zA-Z]*/g, "");
				console.log("Example: payloadIds", payloadIds) /* Check this tomorrow */
        const sizeNum = payload.id.replace(/[^\d+][a-zA-Z]*\d*/g,"");
				console.log("Example: sizeNum", sizeNum) /* Check this tomorrow */
        
        request.get('https://'+config.username+':'+config.password+'@'+config.shop+'.myshopify.com/admin/products/'+payloadIds+'.json?image_id=10859669749832', (err, res, body) => {
          if(!err && res.body == 200) {
            let json = JSON.parse(body);
						console.log("Example: json", json)
          }
        })
        break;

      default:
        console.log("error");
    }
}
}
