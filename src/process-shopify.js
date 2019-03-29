// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = 'fe82343692939d58e3654f6c8131df91';
const password = '915090b3b66d219fbb64feab6599f40b';
const shop = "barista-shop2";

let productApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/products.json';

let collection_url = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=';

let top10productsApi = collection_url + '89296306257',
headphonesApi = collection_url +'89296240721',
sunglassApi = collection_url + '89295814737',
tabletsApi = collection_url + '89295913041',
booksApi = collection_url + '89295945809',
mobilesApi = collection_url + '89296076881',
shoesApi = collection_url + '89296207953',
bagsApi = collection_url + '89295716433',
laptopApi = collection_url + '89296175185';

let top10productslist = [], 
headphoneslist = [], 
sunglasslist = [], 
tabletslist = [], 
bookslist = [], 
mobileslist = [], 
shoeslist = [], 
bagslist = [], 
laptoplist = [];

request.get(top10productsApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      top10productslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(headphonesApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
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

request.get(booksApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      bookslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(mobilesApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      mobileslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(shoesApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      shoeslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(bagsApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      bagslist[i] = json.collects[i].product_id;
    }
  }
});

request.get(laptopApi, (err, response, body) => {
  if (!err && response.statusCode == 200) {
    json = JSON.parse(body);
    for (i in json.collects) {
      laptoplist[i] = json.collects[i].product_id;
    }
  }
});

module.exports = (datafetch) => {
  console.log("datafetch", datafetch);
  request.get(productApi, (err, response, body) => {
    if (!err && response.statusCode == 200 && datafetch) {
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

      switch (datafetch) {

        case "productListCard":
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

        case "productImages":
          msg = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "productVideos":
          msg = "https://www.youtube.com/watch?v=E4n7BQkOQ_s";
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "productList":
          CollectionDisplay(top10productslist);
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

        case "Books":
          CollectionDisplay(bookslist);
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "Mobiles":
          CollectionDisplay(mobileslist);
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "Shoes":
          CollectionDisplay(shoeslist);
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "Bags":
          CollectionDisplay(bagslist);
          responseFormat.responseFormat(msg, datafetch);
          break;

        case "Laptop":
          CollectionDisplay(laptoplist);
          responseFormat.responseFormat(msg, datafetch);
          break;

        default:
          err;
      }
    }
  })
}