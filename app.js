const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// app.use([adminRoutes, shopRoutes]);
app.use('/admin', adminRoutes);

// Catch all
app.use((req, res, next) => {
  res.status(404).send(`<h1>404 Not Found</h1>`);
})

app.listen(6900);
