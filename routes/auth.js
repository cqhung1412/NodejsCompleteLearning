const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const Router = express.Router();

Router.put('/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Pls enter valid email D:')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc =>
          userDoc && Promise.reject('Email already existed D:')
        );
      })
      .normalizeEmail(),
    body('password').trim()
      .isLength({ min: 5 }),
    body('name').trim()
      .not().isEmpty()
  ],
  authController.signup
);

Router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Pls enter valid email D:')
      .normalizeEmail(),
    body('password').trim()
      .isLength({ min: 5 })
  ],
  authController.login
);

module.exports = Router;
