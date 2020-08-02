const path = require('path');

const express = require('express');

const Router = express.Router();

Router.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = Router;
