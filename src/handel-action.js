// const debug = require('debug')('Handel Action');
const processShopify = require('./process-shopify');
const responseFormat = require('./response-msgformat-fb');

let datafetch = '';

module.exports.handleAction = (req, res) => {
  console.log(`\n\n>>>>>>> Webhook Called <<<<<<<`);
  // if (req.body.queryResult.action === 'productList') {
	// 	console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
  //   datafetch = 'productList'
  //   return processShopify(datafetch);
  // } else if (req.body.queryResult.action === 'productListCard') {
  //   console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
  //   datafetch = 'productListCard'
  //   return processShopify(datafetch);
  // } else if (req.body.queryResult.action === 'productImages') {
  //   console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
  //   datafetch = 'productImages'
  //   return processShopify(datafetch);
  // } else if (req.body.queryResult.action === 'productVideos') {
  //   console.log('TCL: module.exports.handleAction -> datafetch', datafetch)
  //   datafetch = 'productVideos'
  //   return processShopify(datafetch);
  // } else {
  //   console.log("Error");
  // }
  // switch (req.body.queryResult.action) {
  //   case 'productList':
  // }
  if(req.body.queryResult.action) {
    datafetch = req.body.queryResult.action;    
    return processShopify(datafetch);
  }
};