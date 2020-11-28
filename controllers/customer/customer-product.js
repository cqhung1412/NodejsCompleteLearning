const Product = require('../../models/product');
const { get404 } = require('../errors');

exports.getIndex = (req, res) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    Product.fetchById(prodId)
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
    req.user.getCart()
        .then(cart => cart.getProducts())
        .then(products => {
            res.render('customer/cart', {
                prods: products,
                pageTitle: 'My Cart',
                path: '/cart',
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res) => {
    const { productId } = req.body; // can't see total price
    let fetchedCart;
    let newQty = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product = products.length > 0 && products[0];
            newQty = product ? product.cartItem.quantity + 1 : newQty;
            return Product.findByPk(productId);
        })
        .then(product => fetchedCart.addProduct(product, {
            through: { quantity: newQty }
        }))
        .then(() => res.redirect('/products'))
        .catch(err => console.log(err));
};

exports.postRemoveFromCart = (req, res) => {
    const { productId } = req.body;
    req.user.getCart()
        .then(cart => cart.getProducts({ where: { id: productId } }))
        .then(products => products[0].cartItem.destroy())
        .then(result => res.redirect('/cart'))
        .catch(err => console.log(err));
}

exports.getCheckout = (req, res) => {
    res.render('customer/checkout', {
        pageTitle: 'Let\'s Checkout',
        path: '/checkout',
    })
};

exports.getOrders = (req, res) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('customer/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            })
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => order.addProducts(products.map(prod => {
                    prod.orderItem = { quantity: prod.cartItem.quantity };
                    return prod;
                })))
                .catch(err => console.log(err));
        })
        .then(result => fetchedCart.setProducts(null))
        .then(result => res.redirect('/orders'))
        .catch(err => console.log(err));
}
