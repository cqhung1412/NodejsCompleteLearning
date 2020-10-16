const fs = require('fs'); // file system
const path = require('path');

const rootDir = require('../util/path');
const productDataPath = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    fs.readFile(productDataPath, (error, fileContent) => {
      let products = [];
      !error ? products = JSON.parse(fileContent) : console.log(error);

      products.push(this);

      fs.writeFile(
        productDataPath, 
        JSON.stringify(products), 
        error => { error && console.log(error); }
      );
    })
  }

  static fetchAll(callback) { 
    fs.readFile(productDataPath, (error, fileContent) => {
      if (error) 
        callback([]);
      callback(JSON.parse(fileContent));
    })
  }
};