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
    const { productId, title, imgUrl, price, desc } = req.body;
    const updatedProduct = new Product(productId, title, imgUrl, price, desc);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.postAddProduct = (req, res) => {
    const { title, imgUrl, price, description } = req.body;
    Product.create({
        title,
        price,
        imgUrl,
        description
    })
        .then(result => {
            res.redirect('/admin/add-product');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    console.log(productId);
    Product.deleteById(productId, products => {
        if (products.length > 0) {
            res.redirect('/admin/products');
        }
        else {
            get404(req, res);
        }
    })
}
