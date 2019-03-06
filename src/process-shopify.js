// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = '8e68b0ada51356f5fe79a3bb660133de';
const password = 'ca1e7b2a49df493443c15f5b5201ee50';
const shop = "internal-example-store";

let productApi = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/products.json';

let collectionApi = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/collections.json';

module.exports = (datafetch) => {
  request.get(productApi, (err, response, body) => {
    if(!err && response.statusCode == 200 && datafetch) {
      let json;
      let i;
      let msg;
      let elements;
      switch(datafetch) {
        case "productList" :
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
          break;

        case "productListCard" :
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
          break;

        case "productImages" :
          msg = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "productVideos" :
          msg = "https://www.youtube.com/watch?v=E4n7BQkOQ_s";
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "Headphones" :
          
          break;

        case "Mobiles" :
        
          break;

        case "" :

          break;

        case "Shoes" :

          break;

        default:
          err;
      }

    }
  })
}