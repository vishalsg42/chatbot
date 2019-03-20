// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = '43a8a24f406c63e004835ce1565fd01b';
const password = 'a895e46425a7067388c8f9c4e00e48d6';
const shop = "barista-shop1";

let productApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/products.json';

let top10productsApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84963459143';
let headphonesApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84818362439';
let sunglassApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84818395207';
let tabletsApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84818460743';
let booksApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84948844615';
let mobilesApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84948975687';
let shoesApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84948942919';
let bagsApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84949041223';
let laptopApi = 'https://' + username + ':' + password + '@' + shop + '.myshopify.com/admin/collects.json?collection_id=84948877383';

let top10productslist = [];
let headphoneslist = [];
let sunglasslist = [];
let tabletslist = [];
let bookslist = [];
let mobileslist = [];
let shoeslist = [];
let bagslist = [];
let laptoplist = [];


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