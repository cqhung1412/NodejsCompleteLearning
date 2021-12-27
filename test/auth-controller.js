const { expect } = require('chai');
const { it, describe } = require('mocha');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function () {
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

  beforeEach(() => {});

  it('Should throw an 500 error if failed accessing database', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'testpass'
      }
    };

    AuthController.login(req, {}, () => { })
      .then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
      })
      .catch(error => done(error));

    User.findOne.restore();
  });

  it('Should send a response with a valid user status for an existing user', function (done) {
    const req = { userId };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };

    AuthController.getStatus(req, res, () => { })
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new :D');
        done();
      })
      .catch(err => done(err));
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});