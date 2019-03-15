// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = '43a8a24f406c63e004835ce1565fd01b';
const password = 'a895e46425a7067388c8f9c4e00e48d6';
const shop = "barista-shop1";

let productApi = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/products.json';

let headphonesApi = 'https://' + username + ':' + password + '@' + shop +'.myshopify.com/admin/collects.json?collection_id=84818362439';
let sunglassApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84818395207';
let tabletsApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84818460743';

let headphoneslist=[];
let sunglasslist=[];
let tabletslist = [];

request.get(headphonesApi, (err, response, body) => {
  if (!err && response.statusCode == 200 ) {
    json = JSON.parse(body);
    for (i in json.collects) {
      headphoneslist[i] = json.collects[i].product_id;      
    }    
  }
});

request.get(sunglassApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      sunglasslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(tabletsApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      tabletslist[i] = json.collects[i].product_id;
    }
  }
});

module.exports = (datafetch) => {
  console.log("datafetch",datafetch);
  request.get(productApi, (err, response, body) => {
    if(!err && response.statusCode == 200 && datafetch) {
      let json;
      let i;
      let msg;
      let elements;      

      function CollectionDisplay(list) {
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

          let totalcollectprod = list;

          for (let j = 0; j < totalcollectprod.length; j++) {
            if (json.products[i].id == totalcollectprod[j]) {

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
          }
        }
      }

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

        case "Headphones":                    
          CollectionDisplay(headphoneslist);
          responseFormat.responseFormat(msg, datafetch);
          break;       

        case "Sunglass":
          CollectionDisplay(sunglasslist);
          responseFormat.responseFormat(msg, datafetch);
          break;  
          
        case "Tablets":
          CollectionDisplay(tabletslist);
          responseFormat.responseFormat(msg, datafetch);
          break;  

        default:
          err;
      }
    }
  })
}

