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

const callWriteFile = updatedProducts => {
  fs.writeFile(
    productDataPath,
    JSON.stringify(updatedProducts),
    error => { error && console.log(error); }
  );
}

module.exports = class Product {
  constructor(id, title, imgUrl, price, desc) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.desc = desc;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const updatedProducts = products.map(prod => 
          prod.id === this.id ? this : prod
        );
        callWriteFile(updatedProducts);
      }
      else {
        const newProduct = {
          ...this, 
          id: Math.round(Date.now() + Math.random()) + ''
        };
        const updatedProducts = [...products, newProduct];
        callWriteFile(updatedProducts);
      }
    })
  }

  static deleteById(id, cb) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(prod => prod.id !== id);
      console.log(updatedProducts);
      callWriteFile(updatedProducts);
      cb(updatedProducts);
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