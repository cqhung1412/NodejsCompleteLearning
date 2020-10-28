const express = require('express');

const productController = require('../controllers/admin/admin-product')

const Router = express.Router();

// /admin/add-product => GET
Router.get('/add-product', productController.getAddProduct);

// /admin/products => GET
Router.get('/products', productController.getProducts);

// /admin/add-product => POST
Router.post('/add-product', productController.postAddProduct);

module.exports = Router;
