const Product = require('../../models/products');
const { get404 } = require('../errors');

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const { isEditing } = req.query;
    if (isEditing) {
        Product.fetchById(productId, foundProduct => {
            if (foundProduct) {
                res.render('admin/edit-product', {
                    pageTitle: 'Admin - Edit Product',
                    path: '/admin/edit-product' + productId,
                    product: foundProduct,
                    editing: isEditing
                });
            }
            else {
                get404(req, res);
            }
        });
    }
    else {
        res.render('admin/edit-product', {
            pageTitle: 'Admin - Add Product',
            path: '/admin/add-product',
            editing: false
        });
    }
};

exports.postEditProduct = (req, res) => {
    
}

exports.postAddProduct = (req, res) => {
    const { title, imgUrl, price, desc } = req.body;
    const product = new Product(title, imgUrl, price, desc);
    product.addProduct();
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};