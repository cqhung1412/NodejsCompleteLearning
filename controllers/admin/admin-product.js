const Product = require('../../models/product');
const { get404 } = require('../errors');

exports.getProducts = (req, res) => {
    const { isLoggedIn } = req.session;
    if (isLoggedIn) {
        Product.find()
            .then(products => res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuth: isLoggedIn
            }))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.getEditProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    if (isLoggedIn) {
        const isEditing = req.query.edit;
        const { productId } = req.params;
        if (isEditing) {
            Product.findById(productId)
                .then(product => {
                    if (!product)
                        return res.sendStatus(404);
                    res.render('admin/edit-product', {
                        pageTitle: 'Admin - Edit Product',
                        path: '/admin/edit-product' + productId,
                        product: product,
                        editing: isEditing,
                        isAuth: isLoggedIn
                    });
                })
                .catch(err => console.log(err));
        }
        else {
            res.render('admin/edit-product', {
                pageTitle: 'Admin - Add Product',
                path: '/admin/add-product',
                editing: false,
                isAuth: isLoggedIn
            });
        }
    } else {
        get404(req, res);
    }
};

exports.postEditProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    if (isLoggedIn) {
        const { productId, title, imgUrl, price, description } = req.body;
        Product.findByIdAndUpdate(productId, {
            title: title,
            price: price,
            description: description,
            imgUrl: imgUrl
        })
            .then(result => res.redirect('/admin/products'))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.postAddProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    if (isLoggedIn) {
        const { title, imgUrl, price, description } = req.body;
        const product = new Product({
            title: title,
            price: price,
            description: description,
            imgUrl: imgUrl,
            userId: req.user
        });
        product.save()
            .then(result => res.redirect('/admin/products'))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }

};

exports.postDeleteProduct = (req, res) => {
    const { isLoggedIn } = req.session;
    if (isLoggedIn) {
        const { productId } = req.body;
        Product.findByIdAndRemove(productId)
            .then(() => res.redirect('/admin/products'))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};
