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

const getProductById = callback => {
  fs.readFile(productDataPath, (error, fileContent) => {
    if (error) {
      console.log(error);
      return {};
    }
    else {
      const result = JSON.parse(fileContent).find(product => product.id === callback);
      return result;
    }
  })
}

module.exports = class Product {
  constructor(title, imgUrl, price, desc) {
    this.id = null;
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.desc = desc;
  }

  save() {
    getProductsFromFile(products => {
      this.id = Math.round(Date.now() + Math.random()) + '';
      products.push(this);
      fs.writeFile(
        productDataPath,
        JSON.stringify(products),
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