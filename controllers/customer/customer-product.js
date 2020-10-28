const Product = require('../../models/products');

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('customer/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('customer/index', {
            prods: products,
            pageTitle: 'My Nodejs Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res) => {
    res.render('customer/cart', {
        pageTitle: 'My Cart',
        path: '/cart',
    })
};

exports.getCheckout = (req, res) => {
    res.render('customer/checkout', {
        pageTitle: 'Let\'s Checkout',
        path: '/checkout',
    })
};