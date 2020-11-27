const { get404 } = require('../controllers/errors');

const getDatabase = require('../util/database').getDatabase;

class Product {
  constructor(title, price, imgUrl, description) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
  }

  save() {
    const db = getDatabase();
    return db.collection('products').insertOne(this)
      .then(result => console.log(result))
      .catch(err => {
        console.log(err);
        get404();
      });
  }
}

module.exports = Product;
