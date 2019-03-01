// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = '8e68b0ada51356f5fe79a3bb660133de';
const password = 'ca1e7b2a49df493443c15f5b5201ee50';
const shop = "internal-example-store";

let productApi = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/products.json';

module.exports = (datafetch) => {
	console.log('TCL: datafetch', datafetch)
  request.get(productApi, (err, response, body) => {
    if (!err && response.statusCode == 200 && datafetch == 'productList') {
      let json = JSON.parse(body);

      console.log('\n\n json------\n',json);
      console.log('json------end');

      // Get the name of all products
      let i="";
      let msg =[];
      let elements = {
        title: '',
        subtitle: '',
        img:'',
        productURL:''
      };

      for (i in json.products) {
        elements.title = json.products[i].title;
        elements.subtitle = "Price : "+json.products[i].variants[0].price;
        elements.img = json.products[i].image.src;
        elements.productURL = json.products[i].handle;

        msg.push(elements);

        elements = {
          title: '',
          subtitle: '',
          img:'',
          productURL: ''
        };
      }
      return responseFormat.responseFormat(msg,datafetch);
    } else if (!err && response.statusCode == 200 && datafetch == 'productListCard') {
      let json = JSON.parse(body);

      // console.log('\n\n json------\n', json);
      // console.log('json------end');

      // Get the name of all products
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
      return responseFormat.responseFormat(msg, datafetch);
    } else if (!err && response.statusCode == 200 && datafetch == 'productImages') {
    
      let msg = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";

      return responseFormat.responseFormat(msg, datafetch);
    } else if (!err && response.statusCode == 200 && datafetch == 'productVideos') {

      let msg = "https://www.youtube.com/watch?v=E4n7BQkOQ_s";

      return responseFormat.responseFormat(msg, datafetch);
    } else {
      let errorMessage = 'I failed to look up the product name list.';
      return res.status(400).json({
        status: {
          code: 400,
          errorType: errorMessage
        }
      });
    }
  })
}