const express = require('express');

const productController = require('../controllers/admin/admin-product');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();

// /admin/edit-product/:id => GET
Router.get('/edit-product/:productId', isAuth, productController.getEditProduct);

// /admin/edit-product => POST
Router.post('/edit-product', isAuth, productController.postEditProduct);

// /admin/delete-product => POST
Router.post('/delete-product', isAuth, productController.postDeleteProduct);

// /admin/add-product => GET
Router.get('/add-product', isAuth, productController.getEditProduct);

// /admin/add-product => POST
Router.post('/add-product', isAuth, productController.postAddProduct);

// /admin/products => GET
Router.get('/products', isAuth, productController.getProducts);

module.exports = Router;
