const User = require('../models/user');

const { validationResult } = require('express-validator');
const { checkStatusCode, createError } = require('../util/errorHandler');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422, errors.array());

  const { email, password, confirmPassword } = req.body;


};