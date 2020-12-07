const User = require('../models/user');

exports.getLogin = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    // validate
    User.findById('5fccdc991dbf601ea0efd7e4')
        .then(user => {
            req.session.userId = user._id;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
                err && console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        err && console.log(err);
        res.redirect('/');
    });
};

exports.getSignup = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuth: isLoggedIn
    });
};

exports.postSignup = (req, res) => {
    const { email, password } = req.body;
};
