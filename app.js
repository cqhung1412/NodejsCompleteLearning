const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/errors');

const User = require('./models/user');

const app = express();

const user = 'cqhung1412';
const password = 'jaVFccX3gHd47Qh4';
const dbname = 'shop';

const uri = `mongodb+srv://${user}:${password}@nodejs-cluster0.pvske.mongodb.net/${dbname}?retryWrites=true&w=majority`;

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5fca7b3e61e222383c943def')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use('/', customerRoutes);
// app.use(customerRoutes);

// Catch all
app.use(errorController.get404)

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Bear',
                        email: 'bear@node.com',
                        cart: { items: [] }
                    });
                    user.save();
                }
            })
            .catch(err => console.log(err));
        app.listen(6900);
    })
    .catch(err => console.log(err));