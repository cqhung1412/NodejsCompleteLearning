const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    // validate
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'You\'ve entered an invalid email or password!');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        req.flash('error', 'You\'ve entered an invalid email or password!');
                        return res.redirect('/login');
                    }
                    req.session.userId = user._id;
                    req.session.isLoggedIn = true;
                    return req.session.save(err => {
                        err && console.log(err);
                        res.redirect('/');
                    });
                })
                .catch(err => console.log(err));
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
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error')
    });
};

exports.postSignup = (req, res) => {
    const { username, email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error', 'Email have already existed!');
                return res.redirect('./signup');
            } else {
                return bcrypt.hash(password, 13)
                    .then(hashedPass => {
                        const newUser = new User({
                            name: username,
                            email: email,
                            password: hashedPass,
                            cart: { items: [] }
                        });
                        return newUser.save();
                    })
                    .then(result => res.redirect('./login'))
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};
