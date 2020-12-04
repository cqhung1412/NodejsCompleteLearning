const Product = require('../../models/product');
const Order = require('../../models/order');
const { get404 } = require('../errors');

exports.getIndex = (req, res) => {
    Product.find()
        .then(products => {
            res.render('customer/index', {
                prods: products,
                pageTitle: 'My Nodejs Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.render('customer/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('customer/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products' + prodId
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('customer/cart', {
                prods: products,
                pageTitle: 'My Cart',
                path: '/cart',
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
    const { productId } = req.body;
    Product.findById(productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/products'))
        .catch(err => console.log(err));
};

exports.postRemoveFromCart = (req, res) => {
    const { productId } = req.body;
    req.user.removeFromCart(productId)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res) => {
    res.render('customer/checkout', {
        pageTitle: 'Let\'s Checkout',
        path: '/checkout',
    })
};

exports.getOrders = (req, res) => {
    Order.find({
        "user.userId": req.user._id
    })
        .then(orders => {
            console.log(orders)
            res.render('customer/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            })
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => ({
                quantity: item.quantity,
                product: { ...item.productId._doc }
            }));
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user//._id
                },
                products: products
            });
            return order.save();
        })
        .then(result => req.user.clearCart())
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}
