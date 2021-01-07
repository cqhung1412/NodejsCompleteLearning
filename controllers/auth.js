const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { checkStatusCode, createError } = require('../util/errorHandler');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422, errors.array());

  const { email, password, name } = req.body;
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        name
      });
      return user.save();
    })
    .then(result => res.status(201).json({
      message: 'User created :D',
      userId: result._id
    }))
    .catch(err => checkStatusCode(err, next));
};