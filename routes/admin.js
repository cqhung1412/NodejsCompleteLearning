const express = require('express');

const productController = require('../controllers/products')

const Router = express.Router();

// /admin/add-product => GET
Router.get('/add-product', productController.getAddProduct);

// /admin/add-product => POST
Router.post('/add-product', productController.postAddProduct);

module.exports = Router;
