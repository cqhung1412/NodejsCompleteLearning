const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const Router = express.Router();

const products = [];

// /admin/add-product => GET
Router.get('/add-product',(req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
Router.post('/add-product',(req, res) => {
  console.log(req.body);
  products.push({ 
    title: req.body.title 
  });
  res.redirect('/');
});

// module.exports = Router;
exports.routes = Router;
exports.products = products;
