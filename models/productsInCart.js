const fs = require('fs'); // file system
const path = require('path');

const rootDir = require('../util/path');
const Product = require('./products');
const productInCartDataPath = path.join(rootDir, 'data', 'productsInCart.json');

const getCartProductsFromFile = callback => {
    fs.readFile(productInCartDataPath, (error, fileContent) => {
        if (error) {
            console.log(error);
            callback([]);
        }
        else {
            callback(JSON.parse(fileContent));
        }
    });
}

module.exports = class ProductInCart {
    constructor(id) {
        this.id = id;
    }

    save() {
        getCartProductsFromFile(cartProducts => {
            if (!cartProducts.find(product => product.id === this.id)) {
                cartProducts.push(this);
                fs.writeFile(
                    productInCartDataPath,
                    JSON.stringify(cartProducts),
                    error => { error && console.log(error); }
                );
            }
            else {
                console.log("Product is in cart");
            }
        });
    }

    static fetchAll(cb) {
        getCartProductsFromFile(cartProducts => {
            if (cartProducts.length !== 0) {
                Product.fetchAll(products => {
                    const productsInCart = [];
                    cartProducts.forEach(cartProd => {
                        const productById = products.find(prod => prod.id === cartProd.id);
                        productsInCart.push(productById);
                    });
                    cb(productsInCart);
                });
            }
            else {
                cb([]);
            }
        });
    }
}
