const Product = require('../../models/products');

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const { isEditing } = req.query;

    if (isEditing) {
        Product.fetchById(productId, foundProduct => {
            res.render('admin/edit-product', {
                pageTitle: 'Admin - Edit Product',
                path: '/admin/edit-product' + productId,
                product: foundProduct
            });
        });        
    }
    else {
        res.render('admin/edit-product', {
            pageTitle: 'Admin - Add Product',
            path: '/admin/add-product',
            product: {}
        });
    }
};

exports.postAddProduct = (req, res) => {
    const { title, imgUrl, price, desc } = req.body;
    const product = new Product(title, imgUrl, price, desc);
    product.save();
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