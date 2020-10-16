const Product = require('../models/products');

exports.getAddProduct = (req, res) => {
  res.render('add-product', { 
    pageTitle: 'Admin - Add Product', 
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop', { 
      prods: products, 
      pageTitle: 'My Nodejs Shop', 
      path: '/',
      hasProducts: products.length > 0, //what are these for?
      activeShop: true,
      productCSS: true
    });
  });
};