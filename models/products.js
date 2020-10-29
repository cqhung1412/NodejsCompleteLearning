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
  });
}

module.exports = class Product {
  constructor(title, imgUrl, price, desc) {
    this.id = null;
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.desc = desc;
  }

  addProduct() {
    getProductsFromFile(products => {
      this.id = Math.round(Date.now() + Math.random()) + '';
      const updatedProducts = [...products, this];
      fs.writeFile(
        productDataPath,
        JSON.stringify(updatedProducts),
        error => { error && console.log(error); }
      );
    });
  }

  static fetchById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      callback(product);
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};