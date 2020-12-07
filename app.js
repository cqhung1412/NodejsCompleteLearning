const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/errors');

const User = require('./models/user');

const user = 'cqhung1412';
const password = 'jaVFccX3gHd47Qh4';
const dbname = 'shop';

const uri = `mongodb+srv://${user}:${password}@nodejs-cluster0.pvske.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
    uri: uri,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'asd24HSOIr3hid',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.userId) {
        next();
    } else {
        User.findById(req.session.userId)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err));
    }
});

app.use('/admin', adminRoutes); // find admin auth first
app.use(customerRoutes); // none then find customer auth
app.use(authRoutes); // none then to login page

// Catch all
app.use(errorController.get404);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(result => app.listen(6900))
    .catch(err => console.log(err));