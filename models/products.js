const rootDir = require('../util/path');

const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imgUrl, price, desc) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.desc = desc;
  }

  save() {

  }

  static deleteById(id) {

  }

  static fetchById(id) {

  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }
};