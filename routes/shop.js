const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const adminData = require('./admin');

const Router = express.Router();

Router.get('/',(req, res) => {
  // console.log(adminData.products); // shared across all users -> we don't want this behavior
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = adminData.products;
  res.render('shop', { prods: products, docTitle: 'My Nodejs Shop', path: '/' });
});

module.exports = Router;
