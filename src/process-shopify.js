// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');
const config = require('./config');
const fetch = require('node-fetch');
const collectionIds = require("./collectionId")

const productApi = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/products.json';

const collection_url = 'https://' + config.username + ':' + config.password + '@' + config.shop + '.myshopify.com/admin/collects.json?collection_id=';

let top10productslist = [], 
headphoneslist = [], 
sunglasslist = [], 
tabletslist = [], 
bookslist = [], 
mobileslist = [], 
shoeslist = [], 
bagslist = [], 
laptoplist = [];

const custom = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections.json`;
const customCollectionsId = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections/`;
const collects = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/collects.json?collection_id=`;

const dataAssociateArray = [];

const fetchData = () => {
  const urls = Object.values(collectionIds);

  const allRequests = urls.map(url =>
    fetch(url).then(response => response.json())
  );

  return Promise.all(allRequests);
}

fetchData().then(arrayOfResponses => {
  const dataArray = Object.entries(collectionIds);
  for (i in dataArray) {
    dataAssociateArray.push(dataArray[i].concat(arrayOfResponses[i].collects));
  }
}).catch(err => console.log(err));

exports.demo = (req, res) => {
  res.status(200).send(collectionIds);
}


// module.exports = (datafetch) => {
//   console.log("datafetch", datafetch);
//   request.get(productApi, (err, response, body) => {
//     if (!err && response.statusCode == 200 && datafetch) {
//       let json;
//       let i;
//       let msg;
//       let elements;

//       function CollectionDisplay(list) {
//         json = JSON.parse(body);
//         // Get the name of all products
//         i = "";
//         msg = [];
//         elements = {
//           title: '',
//           subtitle: '',
//           img: '',
//           productURL: ''
//         };
//         for (i in json.products) {

//           let totalcollectprod = list;

//           for (let j = 0; j < totalcollectprod.length; j++) {
//             if (json.products[i].id == totalcollectprod[j]) {

//               elements.title = json.products[i].title;
//               elements.subtitle = "Price : " + json.products[i].variants[0].price;
//               elements.img = json.products[i].image.src;
//               elements.productURL = json.products[i].handle;

//               msg.push(elements);

//               elements = {
//                 title: '',
//                 subtitle: '',
//                 img: '',
//                 productURL: ''
//               };

//             }
//           }
//         }
//       }

//       switch (datafetch) {

//         case "productListCard":
//           json = JSON.parse(body);

//           // Get the name of all products
//           i = "";
//           msg = [];
//           elements = {
//             title: '',
//             subtitle: '',
//             img: '',
//             productURL: ''
//           };

//           for (i in json.products) {
//             elements.title = json.products[i].title;
//             elements.subtitle = "Price : " + json.products[i].variants[0].price;
//             elements.img = json.products[i].image.src;
//             elements.productURL = json.products[i].handle;

//             msg.push(elements);

//             elements = {
//               title: '',
//               subtitle: '',
//               img: '',
//               productURL: ''
//             };
//           }
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "productImages":
//           msg = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "productVideos":
//           msg = "https://www.youtube.com/watch?v=E4n7BQkOQ_s";
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "productList":
//           CollectionDisplay(top10productslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Headphones":
//           CollectionDisplay(headphoneslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Sunglass":
//           CollectionDisplay(sunglasslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Tablets":
//           CollectionDisplay(tabletslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Books":
//           CollectionDisplay(bookslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Mobiles":
//           CollectionDisplay(mobileslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Shoes":
//           CollectionDisplay(shoeslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Bags":
//           CollectionDisplay(bagslist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         case "Laptop":
//           CollectionDisplay(laptoplist);
//           responseFormat.responseFormat(msg, datafetch);
//           break;

//         default:
//           err;
//       }
//     }
//   })
// }