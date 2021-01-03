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
