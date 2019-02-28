// const debug = require('debug')('Process Shopify');
const responseFormat = require('./response-msgformat-fb');
const request = require('request');

const username = '8e68b0ada51356f5fe79a3bb660133de';
const password = 'ca1e7b2a49df493443c15f5b5201ee50';
const shop = "internal-example-store";

let productApi = 'https://'+username+':'+password+'@'+shop+'.myshopify.com/admin/products.json';

module.exports = (datafetch) => {
  request.get(productApi, (err, response, body) => {
    if (!err && response.statusCode == 200 && datafetch == 'productList') {
      let json = JSON.parse(body);

      // debug('\n\n json------\n',json);
      // debug('json------end',);

      // Get the name of all products
      let i="";
      let msg =[];
      let elements = {
        title: '',
        subtitle: '',
        img:''
      };

      for (i in json.products) {
        elements.title = json.products[i].title;
        elements.subtitle = json.products[i].body_html+"\n Price:"+ json.products[i].variants[0].price;
        elements.img = json.products[i].image.src;

        msg.push(elements);

        elements = {
          title: '',
          subtitle: '',
          img:''
        };
      }
      return responseFormat.responseFormat(msg,datafetch);
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