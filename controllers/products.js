const products = []; // This is model actually!

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
  products.push({ 
    title: req.body.title 
  });
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  res.render('shop', { 
    prods: products, 
    pageTitle: 'My Nodejs Shop', 
    path: '/',
    hasProducts: products.length > 0, //what are these for?
    activeShop: true,
    productCSS: true
  });
};