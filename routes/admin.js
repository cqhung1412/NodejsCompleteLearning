const express = require('express');

const productController = require('../controllers/admin/admin-product')

const Router = express.Router();


// /admin/edit-product/:id => GET
Router.get('/edit-product/:productId', productController.getEditProduct);

// /admin/add-product => GET
Router.get('/add-product', productController.getEditProduct);

// /admin/add-product => POST
Router.post('/add-product', productController.postAddProduct);

// /admin/products => GET
Router.get('/products', productController.getProducts);

module.exports = Router;
