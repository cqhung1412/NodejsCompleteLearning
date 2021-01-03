const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        _id: 'DSHIcnej',
        title: 'First Post',
        content: 'This is the 1st post!',
        imgUrl: 'images/Irene.jpg',
        creator: { name: 'Bear' },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed D:');
    error.statusCode = 422;
    throw error;
  }
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
    .catch(err => {
      if (!err.statusCode)
        err.statusCode = 500;
      next(err);
    });

};
