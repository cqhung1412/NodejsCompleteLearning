const Product = require('../../models/product');

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
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
    Product.findByIdAndUpdate(productId, {
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
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imgUrl: imgUrl,
        userId: userId
    });
    product.save()
        .then(result => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;
    Product.findByIdAndRemove(productId)
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};
