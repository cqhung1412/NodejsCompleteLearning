const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const Router = express.Router();

Router.get('/',(req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = Router;
