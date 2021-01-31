const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../util/is-auth');

const Router = express.Router();

// GET /feed/posts
Router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
Router.post('/post',
  isAuth,
  [
    body(['title', 'content'])
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
Router.get('/post/:postId', isAuth, feedController.getPost);

Router.put('/post/:postId',
  isAuth,
  [
    body(['title', 'content'])
      .trim()
      .isLength({ min: 5 }),
  ],
  feedController.updatePost
);

Router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = Router;