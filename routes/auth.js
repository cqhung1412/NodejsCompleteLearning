const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const Router = express.Router();

Router.get('/login', authController.getLogin);

Router.post('/login', authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);

Router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email :D'),
  authController.postSignup
);

Router.get('/reset', authController.getResetPassword);

Router.post('/reset', authController.postResetPassword);

Router.get('/reset/:resetToken', authController.getNewPassword);

Router.post('/new-password', authController.postNewPassword);

module.exports = Router;