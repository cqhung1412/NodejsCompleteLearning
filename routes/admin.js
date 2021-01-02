const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/admin/admin-product');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();

const productValidators = [
    body('title', 'Please enter a title longer than 3 characters D:')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imgUrl', 'Please paste in an URL D:').isURL(),
    body('price', 'Please enter a rational number D:').isFloat(),
    body('description', '5 <= length of description <= 400 D:')
        .isLength({ min: 5, max: 400 })
        .trim()
]

// /admin/edit-product/:id => GET
Router.get('/edit-product/:productId', isAuth, productController.getEditProduct);

// /admin/edit-product => POST
Router.post(
    '/edit-product',
    productValidators,
    isAuth,
    productController.postEditProduct
);

// /admin/delete-product => POST
Router.post('/delete-product', isAuth, productController.postDeleteProduct);

// /admin/add-product => GET
Router.get('/add-product', isAuth, productController.getEditProduct);

// /admin/add-product => POST
Router.post(
    '/add-product',
    productValidators,
    isAuth,
    productController.postAddProduct
);

// /admin/products => GET
Router.get('/products', isAuth, productController.getProducts);

module.exports = Router;
