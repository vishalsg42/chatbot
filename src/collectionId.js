const request = require('request');
const config = require("./config");

const custom = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections.json`;
const customCollectionsId = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/custom_collections/`;
const collects = `https://${config.username}:${config.password}@${config.shop}.myshopify.com/admin/collects.json?collection_id=`;

module.exports.url = () => {

  const customCollectionsIdUrl = {
    bags: '',
    books: '',
    shoes: '',
    laptops: '',
    tablets: '',
    top10: '',
    headphones: '',
    mobiles: '',
    sunglasses: ''
  };

  request.get(custom, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      json = JSON.parse(body);
      
      for (i in json.custom_collections) {
        switch (json.custom_collections[i].handle) {
          case "bags":
          let bagsId = json.custom_collections[i].id;
          productsId = collects + bagsId + '&fields=product_id';
          customCollectionsIdUrl.bags = productsId;
          break;
          
          case "books":
          let booksId = json.custom_collections[i].id;
          productsId = collects + booksId + '&fields=product_id';
          customCollectionsIdUrl.books = productsId;
          break;
          
          case "headphones":
          let headponesId = json.custom_collections[i].id;
          productsId = collects + headponesId + '&fields=product_id';
          customCollectionsIdUrl.headphones = productsId;
          break;
          
          case "laptops":
          let laptopsId = json.custom_collections[i].id;
          productsId = collects + laptopsId + '&fields=product_id';
          customCollectionsIdUrl.laptops = productsId;
          break;
          
          case "mobiles":
          let mobilesId = json.custom_collections[i].id;
          productsId = collects + mobilesId + '&fields=product_id';
          customCollectionsIdUrl.mobiles = productsId;
          break;
          
          case "shoes":
          let shoesId = json.custom_collections[i].id;
          productsId = collects + shoesId + '&fields=product_id';
          customCollectionsIdUrl.shoes = productsId;
          break;
          
          case "sunglass":
          let sunglassId = json.custom_collections[i].id;
          productsId = collects + sunglassId + '&fields=product_id';
          customCollectionsIdUrl.sunglasses = productsId;
          break;
          
          case "tablets":
          let tabletsId = json.custom_collections[i].id;
          productsId = collects + tabletsId + '&fields=product_id';
          customCollectionsIdUrl.tablets = productsId;
          break;
          
          case "top-10-products":
          let top10Id = json.custom_collections[i].id;
          productsId = collects + top10Id + '&fields=product_id';
          customCollectionsIdUrl.top10 = productsId;
          break;
          
          default:
          err
          console.log('error', err);
        }
      }
    }
  });

  return customCollectionsIdUrl;

}
