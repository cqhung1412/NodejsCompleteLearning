const { expect } = require('chai');
const { it, describe } = require('mocha');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');
const io = require('../socket');

describe('Feed Controller', function () {
  const userId = '5c0f66b979af55031b34728a';
  before(function (done) {
    const username = 'presenceadmin';
    const password = 'wf95bIpJ18dZzCPA';
    const cluster = 'presence-cluster0.hhz9u';
    const dbname = 'test-messages';
    const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;
    mongoose.connect(uri, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true
    })
      .then(() => Post.deleteMany({}))
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'testpass',
          name: 'Test',
          posts: [],
          _id: userId
        });
        return user.save();
      })
      .then(() => done())
      .catch(err => {
        console.log(err);
        done(err);
      })
  });

  it('Should add a created post to the posts of the creator', function (done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: { path: 'abc' },
      userId: userId
    };

    const res = {
      status: function () { return this; },
      json: function () { }
    };

    const stub = sinon.stub(io, 'getIO').callsFake(() => {
      return { emit: function () { } };
    });

    FeedController.createPost(req, res, () => { })
      .then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        stub.restore();
        done();
      })
      .catch(error => done(error));
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => Post.deleteMany({}))
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});