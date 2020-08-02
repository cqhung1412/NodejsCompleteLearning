const express = require('express');

const app = express()

app.use('/',(req, res, next) => {
  console.log('This always runs!!!');
  next();
});

app.use('/product',(req, res, next) => {
  console.log('Inside middleware 1');
  res.send('<h1>Welcome to "Product" page!</h1>');
  // next(); // Cannot set headers after they are sent to the client
});

app.use('/',(req, res, next) => {
  console.log('Inside middleware 2');
  res.send('<h1>Love from Express</h1>');
});

app.listen(6900);