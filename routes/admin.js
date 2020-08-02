const path = require('path');

const express = require('express');

const Router = express.Router();

// /admin/add-product => GET
Router.get('/add-product',(req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// /admin/add-product => POST
Router.post('/add-product',(req, res) => {
  console.log(req.body)
  res.redirect('/');
});

module.exports = Router;
