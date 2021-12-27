const fs = require('fs');
const path = require('path');

const io = require('../socket');
const { validationResult } = require('express-validator');
const { checkStatusCode, createError } = require('../util/errorHandler');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: 'Fetched posts successfully :D',
      posts,
      totalItems
    });
  } catch (err) {
    checkStatusCode(err, next);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw createError('Validation failed D:', 422);
    if (!req.file)
      throw createError('No image provided D:', 422);

    const { title, content } = req.body;
    const imgUrl = req.file.path.replace("\\", "/");
    const post = new Post({
      title,
      content,
      imgUrl,
      creator: req.userId,
    });

    await post.save();
    const creator = await User.findById(req.userId);
    creator.posts.push(post);
    const savedUser = await creator.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: { _id: req.userId, name: creator.name }
      }
    });
    res.status(201).json({
      message: 'Create post successfully!',
      post,
      creator: { _id: creator._id, name: creator.name }
    });
    return savedUser;
  } catch (error) {
    checkStatusCode(error, next);
    return {};
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post)
      throw createError('Post not found D:', 404);
    res.status(200).json({ post, message: 'Fetched post successfully :D' });
  } catch (error) {
    checkStatusCode(error, next);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422);

  const { postId } = req.params;
  const { title, content, image } = req.body;
  let imgUrl = null;
  if (req.file)
    imgUrl = req.file.path.replace('\\', '/');
  else
    imgUrl = image;

  if (!imgUrl)
    throw createError('No file picked D:', 422);

  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post)
      throw createError('Post not found D:', 404);

    if (post.creator._id.toString() !== req.userId)
      throw createError('Not Authorized D:', 403);

    if (imgUrl !== post.imgUrl)
      clearImage(post.imgUrl);

    post.title = title;
    post.content = content;
    post.imgUrl = imgUrl;

    const result = await post.save();

    io.getIO().emit('posts', {
      action: 'update',
      post: result
    });
    res.status(200).json({
      message: 'Post updated :D',
      post
    });
  } catch (error) {
    checkStatusCode(error, next);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post)
      throw createError('Post not found D:', 404);
    if (post.creator.toString() !== req.userId)
      throw createError('Not Authorized D:', 403);

    clearImage(post.imgUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    io.getIO().emit('posts', {
      action: 'delete',
      post: post
    })
    res.status(200).json({ message: 'Post removed!' });
  } catch (error) {
    checkStatusCode(error, next);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
