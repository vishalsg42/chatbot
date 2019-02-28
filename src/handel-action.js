const debug = require('debug')('Handel Action');
const processShopify = require('./process-shopify');
const responseFormat = require('./response-msgformat-fb');

let datafetch = '';

module.exports.handleAction = (req, res) => {
  debug(`\n\n>>>>>>> Webhook Called <<<<<<<`);
  if (req.body.queryResult.action === 'RandomSearch') {
    datafetch = 'productlist'
    return processShopify(datafetch);
  }
};