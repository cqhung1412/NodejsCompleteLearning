const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk('cqhung@node.com')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(errr));
});

app.use('/admin', adminRoutes);
app.use(customerRoutes);

// Catch all
app.use(errorController.get404)

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

sequelize.sync()
    .then(result => User.findByPk('cqhung@node.com'))
    .then(user => {
        if (!user) {
            return User.create({
                email:'cqhung@node.com',
                password: Math.round(Date.now() + Math.random()) + '',
                role: 'ADMIN',
                name: 'Bear Barry'
            })
        }
        else {
            return user;
        }
    })
    .then(admin => app.listen(6900))
    .catch(err => console.log(err));

