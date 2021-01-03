const { validationResult } = require('express-validator');

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

exports.createPost = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed D:', errors: errors.array() });
  }
  const { title, content } = req.body;
  // Create post in db
  res.status(201).json({
    message: 'Create post successfully!',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Bear' },
      createdAt: new Date()
    }
  });
};
