const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);

Router.post('/login', authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);

Router.post(
  '/signup',
  [
    body('username', 'Please enter an username with only text and number (no special character) :D')
      .isAlphanumeric(),
    body('email', 'Please enter a valid email :D')
      .isEmail(),
    body(
      'password',
      'Please enter a password with length of six characters :D'
    )
      .isLength({ min: 6 }),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('You have to enter matching passwords :D');
        }
        return true;
      })
  ],
  authController.postSignup
);

Router.get('/reset', authController.getResetPassword);

Router.post('/reset', authController.postResetPassword);

Router.get('/reset/:resetToken', authController.getNewPassword);

Router.post('/new-password', authController.postNewPassword);

module.exports = Router;