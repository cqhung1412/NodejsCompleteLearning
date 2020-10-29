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

const callWriteFile = (updatedCart) => {
    fs.writeFile(
        cartDataPath,
        JSON.stringify(updatedCart),
        error => { error && console.log(error); }
    );
}

class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0.0;
    }

    static fetchAll(cb) {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            if (products.length > 0) {
                cb(products, totalPrice);
            }
            else {
                cb([], 0.0);
            }
        });
    }

    static deleteProduct(id) {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            const product = products.find(prod => prod.id === id);
            const updatedCartProducts = products.filter(prod => prod.id !== id);
            const updatedTotalPrice = Number(totalPrice) - Number(product.price);
            const updatedCart = { products: updatedCartProducts, totalPrice: updatedTotalPrice.toFixed(2) };
            callWriteFile(updatedCart);
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
                };
                callWriteFile(updatedCart);
            }
            else {
                console.log("Product is already in cart");
            }
        });
    }
}

module.exports = {
    CartInstance: Cart,
    CartItem: CartItem
}