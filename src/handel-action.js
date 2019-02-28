// const debug = require('debug')('Handel Action');
const processShopify = require('./process-shopify');
const responseFormat = require('./response-msgformat-fb');

let datafetch = '';

module.exports.handleAction = (req, res) => {
  // debug(`\n\n>>>>>>> Webhook Called <<<<<<<`);
  if (req.body.queryResult.action === 'RandomSearch') {
		console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
    datafetch = 'productlist'
    return processShopify(datafetch);
  } else{
		console.log("Error")
  }
};