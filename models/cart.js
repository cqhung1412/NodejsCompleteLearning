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

module.exports = class Cart {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }

    save() {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            if (!products.find(product => product.id === this.id)) {
                products.push(this);
                const newPrice = Number(totalPrice) + Number(this.price);
                const updatedCart = {
                    products: products,
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

    static fetchAll(cb) {
        getCartFromFile(cart => {
            const { products, totalPrice } = cart;
            if (products.length !== 0) {
                Product.fetchAll(allProducts => {
                    const productsInCart = [];
                    products.forEach(cartProd => {
                        const productById = allProducts.find(prod => prod.id === cartProd.id);
                        productsInCart.push(productById);
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
