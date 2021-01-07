const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const Router = express.Router();

// GET /feed/posts
Router.get('/posts', feedController.getPosts);

// POST /feed/post
Router.post('/post',
  [
    body(['title', 'content'])
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
Router.get('/post/:postId', feedController.getPost);

Router.put('/post/:postId',
  [
    body(['title', 'content'])
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.updatePost
);

Router.delete('/post/:postId', feedController.deletePost);

module.exports = Router;