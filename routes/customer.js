const express = require('express');

const productController = require('../controllers/customer/customer-product')

const Router = express.Router();

Router.get('/', productController.getIndex);

Router.get('/products', productController.getProducts);

Router.get('/cart', productController.getCart);

Router.get('/checkout', productController.getCheckout);

Router.get('/orders', productController.getOrders);

module.exports = Router;
