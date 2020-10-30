const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(customerRoutes);

// Catch all
app.use(errorController.get404)

sequelize.sync()
    .then(result => {
        // console.log(result);
        app.listen(6900);
    })
    .catch(err => console.log(err));

