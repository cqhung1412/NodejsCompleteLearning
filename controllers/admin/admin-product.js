const Product = require('../../models/products');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin - Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/'
        });
    });
};