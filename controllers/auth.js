const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bearnodelearning@gmail.com',
        pass: 'bearnodetesting'
    }
});

const signupEmail = (toEmail, name) => {
    return {
        from: 'Barry Bear',
        to: toEmail,
        subject: 'Welcome to Bear Shop :D',
        html: '<h4>Welcome ' + name + '!</h4><p>We are glad to have you onboard :D</p>'
    }
}

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
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
                    .then(result => {
                        const emailOption = signupEmail(email, username);
                        req.flash('success', 'Signup successfully, check your email :D');
                        res.redirect('./login');
                        return transporter.sendMail(emailOption, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Message sent: ' + info.response);
                            }
                        });
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};

exports.getResetPassword = (req, res) => {
    res.render('auth/reset-password', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: req.flash('error')
    });
};
