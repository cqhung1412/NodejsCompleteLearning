const Product = require('../../models/products');
const Cart = require('../../models/cart');

exports.getIndex = (req, res) => {
    Product.fetchAll(products => {
        res.render('customer/index', {
            prods: products,
            pageTitle: 'My Nodejs Shop',
            path: '/'
        });
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('customer/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.fetchById(prodId, foundProduct => {
        res.render('customer/product-detail', {
            product: foundProduct,
            pageTitle: foundProduct.title,
            path: '/products' + prodId
        });
    });
};

exports.getCart = (req, res) => {
    Cart.Cart.fetchAll((products, totalPrice) => {
        res.render('customer/cart', {
            prods: products,
            totalPrice: totalPrice,
            pageTitle: 'My Cart',
            path: '/cart',
        })
    })
    
};

exports.postCart = (req, res) => {
    const { productId, productPrice } = req.body; 
    const cartItem = new Cart.CartItem(productId, productPrice);
    cartItem.addToCart();
    res.redirect('/products');
}

exports.getCheckout = (req, res) => {
    res.render('customer/checkout', {
        pageTitle: 'Let\'s Checkout',
        path: '/checkout',
    })
};

exports.getOrders = (req, res) => {
    res.render('customer/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    })
};
