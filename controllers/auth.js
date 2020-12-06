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
            res.redirect('/');
        })
        .catch(err => console.log(err));
};