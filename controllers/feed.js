const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const { checkStatusCode, createError } = require('../errorHandler');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;
  let totalItems;
  Post.find().countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => res.status(200).json({
      message: 'Fetched posts successfully :D',
      posts,
      totalItems
    }))
    .catch(err => checkStatusCode(err, next));
};

exports.createPost = (req, res, next) => {
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
        throw createError('Post not found D:', 404);
      res.status(200).json({ post, message: 'Fetched post successfully :D' });
    })
    .catch(err => checkStatusCode(err, next));
};

exports.updatePost = (req, res, next) => {
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

  Post.findById(postId)
    .then(post => {
      if (!post)
        throw createError('Post not found D:', 404);
      
      if (imgUrl !== post.imgUrl)
        clearImage(post.imgUrl);

      post.title = title;
      post.content = content;
      post.imgUrl = imgUrl;
      return post.save();
    })
    .then(result => res.status(200).json({ 
      message: 'Post updated :D', 
      post: result 
    }))
    .catch(err => checkStatusCode(err, next));
};

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then(post => {
      if (!post)
        throw createError('Post not found D:', 404);
      
      // Check login user
      clearImage(post.imgUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => res.status(200).json({
      message: 'Post removed!'
    }))
    .catch(err => checkStatusCode(err, next));
}; 

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
