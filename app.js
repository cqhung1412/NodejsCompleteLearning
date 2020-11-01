const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/errors');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
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

// Admin create products
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
// User has 1 cart
User.hasOne(Cart);
Cart.belongsTo(User);
// A cart has many products/A product belongs to many carts
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// User has many orders
User.hasMany(Order);
Order.belongsTo(User);
// An order has many products/A product belongs to many orders
Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

sequelize.sync(/*{ force: true }*/)
    .then(result => User.findByPk(1))
    .then(user => {
        if (!user) {
            return User.create({
                id: 1,
                email: 'cqhung@node.com',
                password: Math.round(Date.now() + Math.random()) + '',
                role: 'ADMIN',
                name: 'Bear Barry'
            });
        }
        else {
            return user;
        }
    })
    .then(admin => admin.getCart())
    .then(cart => {
        if (!cart) {
            admin.createCart();
        }
        app.listen(6900);
    })
    .catch(err => console.log(err));

