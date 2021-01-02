const express = require('express');

const feedController = require('../controllers/feed');

const Router = express.Router();

// GET /feed/posts
Router.get('/posts', feedController.getPosts);

// POST /feed/post
Router.post('/post', feedController.createPost);

module.exports = Router;