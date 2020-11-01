const Product = require('../../models/product');
const Cart = require('../../models/cart');
const { get404 } = require('../errors');

const { CartInstance, CartItem } = Cart;

exports.getIndex = (req, res) => {
    Product.findAll()
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
    Product.findAll()
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
    Product.findByPk(prodId)
        .then((product) => {
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
                prods: products, // no qty here
                pageTitle: 'My Cart',
                path: '/cart',
            });
        })
        .catch(err => console.log(err));
    // CartInstance.fetchAll((cartProducts, totalPrice) => {
    //     Product.fetchAll(allProducts => {
    //         const fullCartProducts = [];
    //         cartProducts.forEach(cartProd => {
    //             const productById = allProducts.find(prod => prod.id === cartProd.id);
    //             fullCartProducts.push({ ...productById, qty: cartProd.qty }); // not functional programming
    //         });
    //         
    //     });

    // });
};

exports.postCart = (req, res) => {
    const { productId, productPrice } = req.body;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId }});
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQty = 1;
            if (product) {
                // quantity of the product >= 1
                // then increment qty
            }
            return Product.findByPk(productId)
                .then(product => fetchedCart.addProduct(product, { 
                    through: { quantity: newQty } 
                }))
        })
        .then(() => res.redirect('/products'))
        .catch(err => console.log(err));
    // const cartItem = new CartItem(productId, productPrice);
    // cartItem.addToCart();
    // 
};

exports.postRemoveFromCart = (req, res) => {
    const { productId } = req.body;
    CartInstance.removeSingleProduct(productId);
    res.redirect('/cart');
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
