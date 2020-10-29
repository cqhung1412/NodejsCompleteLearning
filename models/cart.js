const fs = require('fs'); // file system
const path = require('path');

const rootDir = require('../util/path');
const Product = require('./products');
const cartDataPath = path.join(rootDir, 'data', 'cart.json');

const getCartFromFile = callback => {
    fs.readFile(cartDataPath, (error, fileContent) => {
        if (error) {
            console.log(error);
            callback([]);
        }
        else {
            callback(JSON.parse(fileContent)); // cb with cart = { products: [], totalPrice: number}
        }
    });
}

class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0.0;
    }

    static fetchAll(cb) {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            if (products.length !== 0) {
                Product.fetchAll(allProducts => {
                    const productsInCart = [];
                    products.forEach(cartProd => {
                        const productById = allProducts.find(prod => prod.id === cartProd.id);
                        productsInCart.push(productById); // not functional programming
                    });
                    cb(productsInCart, totalPrice);
                });
            }
            else {
                cb([], 0.0);
            }
        });
    }
}

class CartItem {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }

    addToCart() {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            if (!products.find(product => product.id === this.id)) {
                const newPrice = Number(totalPrice) + Number(this.price);
                const updatedCart = {
                    products: [...products, this],
                    totalPrice: newPrice.toFixed(2)
                }
                fs.writeFile(
                    cartDataPath,
                    JSON.stringify(updatedCart),
                    error => { error && console.log(error); }
                );
            }
            else {
                console.log("Product is already in cart");
            }
        });
    }
}

module.exports = {
    Cart: Cart,
    CartItem: CartItem
}