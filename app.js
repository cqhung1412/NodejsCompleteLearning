const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product',(req, res) => {
  res.send(`
    <h1>Welcome to "Add Product" page!</h1>
    <form action="/product" method="POST">
      <input type="text" name="title"/>
      <button type="Submit">Add New Product</button>
    </form>
  `);
});

app.use('/product',(req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/',(req, res, next) => {
  console.log(req.body);
  res.send(`<h1>Love from Express and ${req.body.title}</h1>`);
});

app.listen(6900);
