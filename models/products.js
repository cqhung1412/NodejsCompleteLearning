const fs = require('fs'); // file system
const path = require('path');

const rootDir = require('../util/path');
const productDataPath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = callback => {
  fs.readFile(productDataPath, (error, fileContent) => {
    if (error) {
      console.log(error);
      callback([]);
    }
    else {
      callback(JSON.parse(fileContent));
    }
  })
}

module.exports = class Product {
  constructor(title, imgUrl, price, desc) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.desc = desc;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(
        productDataPath,
        JSON.stringify(products),
        error => { error && console.log(error); }
      );
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};