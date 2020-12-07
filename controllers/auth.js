const bcrypt = require('bcryptjs');

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
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                throw "User does not exist!";
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch) {
                        throw "User does not exist!";
                    }
                    req.session.userId = user._id;
                    req.session.isLoggedIn = true;
                    return req.session.save(err => {
                        err && console.log(err);
                        res.redirect('/');
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect(404, '/login');
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect(404, '/login');
        });
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
    const { username, email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.redirect('/signup', 409);
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
