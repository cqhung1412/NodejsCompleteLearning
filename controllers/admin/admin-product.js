const { validationResult } = require('express-validator');

const Product = require('../../models/product');

exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id })
        .then(products => res.render('admin/products', {
            prods: products,
            pageTitle: 'Your Products',
            path: '/admin/products'
        }))
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
    const isEditing = req.query.edit;
    const { productId } = req.params;
    if (isEditing) {
        Product.findById(productId)
            .then(product => {
                if (!product)
                    return res.sendStatus(404);
                const { _id, title, imgUrl, price, description } = product;
                res.render('admin/edit-product', {
                    pageTitle: 'Admin - Edit Product',
                    path: '/admin/edit-product' + productId,
                    editing: isEditing,
                    errors: [],
                    oldData: {
                        productId: _id,
                        title,
                        imgUrl,
                        price,
                        description
                    }
                });
            })
            .catch(err => console.log(err));
    } else {
        res.render('admin/edit-product', {
            pageTitle: 'Admin - Add Product',
            path: '/admin/add-product',
            editing: false,
            errors: [],
            oldData: {
                productId: undefined,
                title: '',
                imgUrl: '',
                price: '',
                description: ''
            }
        });
    }
};

exports.postEditProduct = (req, res) => {
    const { productId, title, imgUrl, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Admin - Edit Product',
            path: '/admin/edit-product' + productId,
            editing: true,
            errors: errors.array(),
            oldData: {
                productId,
                title,
                imgUrl,
                price,
                description
            }
        });
    }
    Product.findOneAndUpdate({
        _id: productId,
        userId: req.user._id
    }, {
        title: title,
        price: price,
        description: description,
        imgUrl: imgUrl
    })
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
    const { userId } = req.session;
    const { title, imgUrl, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Admin - Add Product',
            path: '/admin/add-product',
            editing: false,
            errors: errors.array(),
            oldData: {
                productId: undefined,
                title,
                imgUrl,
                price,
                description
            }
        });
    }
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imgUrl: imgUrl,
        userId: userId
    });
    product.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(result => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};
