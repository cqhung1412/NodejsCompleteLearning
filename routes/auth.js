const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
const User = require('../models/user');

const Router = express.Router();

Router.get('/login', authController.getLogin);

Router.post(
  '/login',
  [
    body('email')
      .custom((value, { req }) => {
        User.findOne({ email: value })
          .then(user => {
            if (!user) {
              return Promise.reject('These are invalid email and password, try again D:');
            }
            return true;
          })
      })
  ],
  authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);

Router.post(
  '/signup',
  [
    body('username', 'Please enter an username with only text and number (no special character) :D')
      .isAlphanumeric(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email :D')
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('Email have already existed, please choose a different one :D');
            }
          });
      }),
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