const express = require('express');

const app = express()

app.use((req, res, next) => {
  console.log('Inside middleware 1');
  next(); // Allows the req come to below middleware
});

app.use((req, res, next) => {
  console.log('Inside middleware 2');
  res.send('<h1>Love from Express</h1>');
  next();
});

app.listen(6900);
