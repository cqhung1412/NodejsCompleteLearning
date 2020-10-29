const express = require('express');

const productController = require('../controllers/customer/customer-product')

const Router = express.Router();

// Landing page
Router.get('/', productController.getIndex);

// Product page
Router.get('/products', productController.getProducts);

// Product detail page
Router.get('/products/:productId', productController.getProductDetail);

// Cart page
Router.get('/cart', productController.getCart);

Router.post('/cart', productController.postCart);

// Checkout page
Router.get('/checkout', productController.getCheckout);

// Order page
Router.get('/orders', productController.getOrders);

module.exports = Router;
