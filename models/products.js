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
    const { title, price, imgUrl } = this;
    return db.execute(
      'INSERT INTO products(title,price,imgUrl, `desc`) VALUES (?, ?, ?, ?)',
      [title, price, imgUrl, this.desc] // desc is descending in order by
    );
  }

  static deleteById(id) {

  }

  static fetchById(id) {
    return db.execute(
      'SELECT * FROM products WHERE products.id = ?',
      [id]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }
};