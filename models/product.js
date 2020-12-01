const { get404 } = require('../controllers/errors');

const mongodb = require('mongodb');
const getDatabase = require('../util/database').getDatabase;

class Product {
  constructor(title, price, imgUrl, description, id = null) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
    if (id) {
      this._id = new mongodb.ObjectId(id);
    }
  }

  save() {
    const db = getDatabase();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products').updateOne({
        _id: this._id
      }, {
        $set: this
      });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => console.log(result))
      .catch(err => {
        console.log(err);
        get404();
      });
  }

  static fetchAll() {
    const db = getDatabase();
    return db.collection('products').find().toArray()
      .then(products => products)
      .catch(err => {
        console.log(err);
        get404();
      });
  }

  static fetchById(prodId) {
    const db = getDatabase();
    return db.collection('products').find({
      _id: new mongodb.ObjectID(prodId)
    }).next()
      .then(product => product)
      .catch(err => {
        console.log(err);
        get404();
      });
  }

  static deleteById(prodId) {
    const db = getDatabase();
    return db.collection('products').deleteOne({
      _id: new mongodb.ObjectId(prodId)
    })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
