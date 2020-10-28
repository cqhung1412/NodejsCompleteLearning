const fs = require('fs'); // file system
const path = require('path');

const rootDir = require('../util/path');
const Product = require('./products');
const productInCartDataPath = path.join(rootDir, 'data', 'productsInCart.json');
const allProductDataPath = path.join(rootDir, 'data', 'products.json');

const getProductIdsFromFile = callback => {
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
        getProductIdsFromFile(productIds => {
            productIds.push(this);
            fs.writeFile(
                productInCartDataPath,
                JSON.stringify(productIds),
                error => { error && console.log(error); }
            );
        });
    }

    static fetchAll(cb) {
        getProductIdsFromFile(productIds => {
            Product.fetchAll(products => {
                const productsInCart = [];
                productIds.forEach(prodId => {
                    const productById = products.find(prod => prod.id === prodId.id);
                    productsInCart.push(productById);
                    cb(productsInCart);
                });
            });
        });
    }
}
