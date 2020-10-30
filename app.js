const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const app = express();

const errorController = require('./controllers/errors');

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(customerRoutes);

// Catch all
app.use(errorController.get404)

app.listen(6900);