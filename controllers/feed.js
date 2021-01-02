exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        title: 'First Post',
        content: 'This is the 1st post!'
      }
    ]
  });
};

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  // Create post in db
  res.status(201).json({
    message: 'Create post successfully!',
    post: {
      id: new Date().toISOString(),
      title,
      content
    }
  });
};
