const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  checkStatusCode,
  createError
} = require('../util/errorHandler');

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

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422, errors.array());

  const { email, password } = req.body;
  User.findOne({
    email: email
  })
    .then(user => {
      if (!user)
        throw createError('User not found D:', 401); // 401: not authenticated
        
      return bcrypt.compare(password, user.password)
        .then(isEqual => {
          if (!isEqual)
            throw createError('Wrong password D:', 401);
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString()
            }, 
            'asecretprivatekey', 
            { expiresIn: '1h' }
          );
          res.status(200).json({
            token,
            userId: user._id.toString()
          });
        })
    })
    .catch(err => checkStatusCode(err, next));
};


exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user)
        throw createError('User not found D:', 404);

      res.status(200).json({ status: user.status })
    })
    .catch(err => checkStatusCode(err, next));
};

exports.updateStatus = (req, res, next) => {
  const { status } = req.body;
  User.findById(req.userId)
    .then(user => {
      if (!user)
        throw createError('User not found D:', 404);

      if (user._id.toString() !== req.userId)
        throw createError('Not Authorized D:', 403);
      
      user.status = status;
      return user.save();
    })
    .then(result => res.status(200).json({ message: 'Successfully updated status :D' }))
    .catch(err => checkStatusCode(err, next));
};
