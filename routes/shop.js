const express = require('express');

const Router = express.Router();

Router.get('/',(req, res) => {
  res.send(`<h1>Love from Express</h1>`);
});

module.exports = Router;
