const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

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
        html: `
            <h3>Welcome ${name}!</h3>
            <p>We are glad to have you onboard :D</p>
        `
    }
};

const resetPasswordEmail = (toEmail, token) => {
    return {
        from: 'Barry Bear',
        to: toEmail,
        subject: 'Password Reset',
        html: `
            <h3>You\'ve requested a password reset</h3>
            <p>Click this <a href="http://localhost:6900/reset/${token}">link</a> to set a new password :D</p>
        `
    }
};

const sendEmail = (emailOption) => {
    return transporter.sendMail(emailOption, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg
        });
    }
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
                        return sendEmail(emailOption);
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
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
};

exports.postResetPassword = (req, res) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Something is wrong!');
            return res.redirect('/reset');
        } else {
            const token = buffer.toString('hex');
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        console.log('No account found!');
                        return req.flash('success', 'We will send an link to your email if the email is registered :D');
                    }
                    console.log('There is an account found!');
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600000; // + 1 hour
                    req.flash('success', 'We will send an link to your email if the email is registered :D');
                    return user.save();
                })
                .then(result => res.redirect('/reset'))
                .then(result => {
                    const emailOption = resetPasswordEmail(email, token);
                    return sendEmail(emailOption);
                })
                .catch(console.error);
        }
    });
};

exports.getNewPassword = (req, res) => {
    const { resetToken } = req.params;
    User.findOne({
        resetToken: resetToken,
        resetTokenExpiration: { $gt: Date.now() }
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Your token is invalid, try resetting again, pls D:');
                return res.redirect('/reset');
            }
            return res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                userId: user._id.toString()
            });
        })
        .catch(console.error);
};

exports.postNewPassword = (req, res) => {
    const { userId, password } = req.body;
    User.findById(userId)
        .then(user => {
            if (!user) {
                req.flash('error', 'Something went wrong D:');
                return res.redirect('/reset');
            }
            return bcrypt.hash(password, 13)
                .then(hashedPass => {
                    user.password = hashedPass;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    return user.save();
                })
                .catch(console.error);
        })
        .then(result => {
            req.flash('success', 'Reset password successfully!');
            return res.redirect('/login');
        })
        .catch(console.error);
}
