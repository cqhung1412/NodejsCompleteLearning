const Product = require('../../models/product');

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const { isEditing } = req.query;
    if (isEditing) {
        Product.fetchById(productId)
            .then(product => {
                res.render('admin/edit-product', {
                    pageTitle: 'Admin - Edit Product',
                    path: '/admin/edit-product' + productId,
                    product: product,
                    editing: isEditing
                });
            })
            .catch(err => console.log(err));
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
    const { productId, title, imgUrl, price, description } = req.body;
    Product.fetchById(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imgUrl = imgUrl;
            product.description = description;
            return product.save();
        })
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
    const { title, imgUrl, price, description } = req.body;
    const product = new Product(title, price, imgUrl, description);
    product.save()
        .then(result => res.redirect('/admin/add-product'))
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    Product.fetchAll()
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
    Product.fetchById(productId)
        .then(product => product.destroy())
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}
