const express = require('express');

const productController = require('../controllers/customer/customer-product');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();

// Landing page
Router.get('/', productController.getIndex);

// Product page
Router.get('/products', productController.getProducts);

// Product detail page
Router.get('/products/:productId', productController.getProductDetail);

// // Cart page
Router.get('/cart', isAuth, productController.getCart);

Router.post('/cart', isAuth, productController.postCart);

Router.post('/remove-from-cart', isAuth, productController.postRemoveFromCart);

// Order page
Router.post('/order', isAuth, productController.postOrder);

Router.get('/orders', isAuth, productController.getOrders);

module.exports = Router;
