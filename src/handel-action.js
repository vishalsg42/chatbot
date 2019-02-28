// const debug = require('debug')('Handel Action');
const processShopify = require('./process-shopify');
const responseFormat = require('./response-msgformat-fb');

let datafetch = '';

module.exports.handleAction = (req, res) => {
  console.log(`\n\n>>>>>>> Webhook Called <<<<<<<`);
  console.log(req.body, "********************88888888");
  if (req.body.queryResult.action === 'productList') {
		console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
    datafetch = 'productList'
    return processShopify(datafetch);
  } else{
		console.log("Error")
  }
};