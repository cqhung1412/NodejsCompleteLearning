const Product = require('../../models/product');
const Order = require('../../models/order');
const User = require('../../models/user');
const { get404 } = require('../errors');

exports.getIndex = (req, res) => {
    const { isLoggedIn } = req.session;
    Product.find()
        .then(products => res.render('customer/index', {
            prods: products,
            pageTitle: 'My Nodejs Shop',
            path: '/',
            isAuth: isLoggedIn
        }))
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    const { isLoggedIn } = req.session;
    Product.find()
        .then(products => res.render('customer/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isAuth: isLoggedIn
        }))
        .catch(err => console.log(err));
};

exports.getProductDetail = (req, res) => {
    const { isLoggedIn } = req.session;
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => res.render('customer/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products' + prodId,
            isAuth: isLoggedIn
        }))
        .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    const { isLoggedIn, userId } = req.session;
    if (isLoggedIn) {
        User.findById(userId)
            .then(user => {
                user.populate('cart.items.productId')
                    .execPopulate()
                    .then(userWithCartProd => {
                        const products = userWithCartProd.cart.items;
                        res.render('customer/cart', {
                            prods: products,
                            pageTitle: 'My Cart',
                            path: '/cart',
                            isAuth: isLoggedIn
                        });
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.postCart = (req, res) => {
    const { isLoggedIn, userId } = req.session;
    if (isLoggedIn) {
        const { productId } = req.body;
        Product.findById(productId)
            .then(product => {
                User.findById(userId)
                    .then(user => user.addToCart(product))
                    .catch(err => console.log(err));
            })
            .then(() => res.redirect('/products'))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.postRemoveFromCart = (req, res) => {
    const { isLoggedIn, userId } = req.session;
    if (isLoggedIn) {
        const { productId } = req.body;
        User.findById(userId)
            .then(user => user.removeFromCart(productId))
            .then(() => res.redirect('/cart'))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.getOrders = (req, res) => {
    const { isLoggedIn, userId } = req.session;
    if (isLoggedIn) {
        Order.find({
            "user.userId": userId
        })
            .then(orders => res.render('customer/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                isAuth: isLoggedIn
            }))
            .catch(err => console.log(err));
    } else {
        get404(req, res);
    }
};

exports.postOrder = (req, res) => {
    const { isLoggedIn, userId } = req.session;
    if (isLoggedIn) {
        User.findById(userId)
            .then(user => user.populate('cart.items.productId')
                .execPopulate()
                .then(userWithCartProd => {
                    const products = userWithCartProd.cart.items.map(item => ({
                        quantity: item.quantity,
                        product: { ...item.productId._doc }
                    }));
                    const order = new Order({
                        user: {
                            name: user.name,
                            userId: user//._id
                        },
                        products: products
                    });
                    return order.save();
                })
                .then(result => user.clearCart())
                .then(result => res.redirect('/cart'))
                .catch(err => console.log(err))
            )
    } else {
        get404(req, res);
    }
};
