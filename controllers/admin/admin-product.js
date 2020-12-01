const Product = require('../../models/product');

exports.getEditProduct = (req, res) => {
    const { productId } = req.params;
    const isEditing = req.query.edit;
    if (isEditing) {
        Product.fetchById(productId)
            .then(product => {
                if (!product)
                    return res.sendStatus(404);
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
    const product = new Product(
        title, 
        price, 
        imgUrl, 
        description, 
        productId
    );
    product.save()
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.postAddProduct = (req, res) => {
    const { title, imgUrl, price, description } = req.body;
    const product = new Product(title, price, imgUrl, description);
    product.save()
        .then(result => res.redirect('/admin/products'))
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
    Product.deleteById(productId)
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
}
