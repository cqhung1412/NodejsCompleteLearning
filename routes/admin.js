const express = require('express');

const Router = express.Router();

Router.get('/add-product',(req, res) => {
  res.send(`
    <h1>Welcome to "Add Product" page!</h1>
    <form action="/product" method="POST">
      <input type="text" name="title"/>
      <button type="Submit">Add New Product</button>
    </form>
  `);
});

Router.post('/product',(req, res) => {
  console.log(req.body);
  res.send(`<h1>Product from Express is ${req.body.title}</h1>`);
  // res.redirect('/');
});

module.exports = Router;
