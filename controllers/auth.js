const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  checkStatusCode,
  createError
} = require('../util/errorHandler');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422, errors.array());

  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    const createdUser = await user.save();
    res.status(201).json({
      message: 'User created :D',
      userId: createdUser._id
    });
  } catch (error) {
    checkStatusCode(error, next);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422, errors.array());

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      throw createError('User not found D:', 401); // 401: not authenticated

    const isEqual = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    checkStatusCode(error, next);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      throw createError('User not found D:', 404);

    res.status(200).json({ status: user.status })
  } catch (error) {
    checkStatusCode(error, next);
  }
};

exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user)
      throw createError('User not found D:', 404);
    if (user._id.toString() !== req.userId)
      throw createError('Not Authorized D:', 403);

    user.status = status;
    await user.save();
    res.status(200).json({ message: 'Successfully updated status :D' });
  } catch (error) {
    checkStatusCode(error, next);
  }
};
