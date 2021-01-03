const { validationResult } = require('express-validator');
const { checkStatusCode, createError } = require('../errorHandler');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Fetched posts successfully :D',
        posts
      })
    })
    .catch(err => checkStatusCode(err, next));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw createError('Validation failed D:', 422);
  const { title, content } = req.body;
  // Create post in db
  const post = new Post({
    title,
    content,
    imgUrl: 'images/Irene.jpg',
    creator: { name: 'Bear' },
  });
  post.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Create post successfully!',
        post: result
      });
    })
    .catch(err => checkStatusCode(err, next));
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post)
        throw createError('Post not found', 404);
      res.status(200).json({ post, message: 'Fetched post successfully :D' });
    })
    .catch(err => checkStatusCode(err, next));
};
