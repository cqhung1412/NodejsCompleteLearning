const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const Router = express.Router();

const products = [];

// /admin/add-product => GET
Router.get('/add-product',(req, res) => {
  res.render('add-product', { 
    pageTitle: 'Admin - Add Product', 
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
});

// /admin/add-product => POST
Router.post('/add-product',(req, res) => {
  // console.log(req.body);
  products.push({ 
    title: req.body.title 
  });
  res.redirect('/');
});

exports.routes = Router;
exports.products = products;
