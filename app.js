const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors');

const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// const adminRoutes = require('./routes/admin');
// const customerRoutes = require('./routes/customer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
});

// app.use('/admin', adminRoutes);
// app.use(customerRoutes);

// Catch all
app.use(errorController.get404)

mongoConnect((client) => {
    console.log(client);
    app.listen(6900);
})