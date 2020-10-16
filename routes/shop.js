const express = require('express');

const productController = require('../controllers/products')

const Router = express.Router();

Router.get('/', productController.getProducts);

module.exports = Router;
