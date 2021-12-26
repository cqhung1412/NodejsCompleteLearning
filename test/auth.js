const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const { it, describe } = require('mocha');
const authMiddleware = require('../util/is-auth');
const Sinon = require('sinon');

describe('Auth Middleware', function () {
  it('Should throw an error if there is no authorization header is present', function () {
    const req = { get: headerName => null };
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw('Not authenticated');
  });

  it('Should throw an error if the auth header is a string without space', function () {
    const req = { get: headerName => 'headerData' };
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw();
  });

  it('Should yield a userId after decoding the token', function () {
    // const token = jwt.sign({ userId: 'someUserId' }, 'asecretprivatekey');
    // const req = { get: headerName => `Bearer ${token}` };
    // jwt.verify = () => ({ userId: 'someUserId' });
    const req = { get: headerName => `Bearer dasdadaasasdasdsawqe` };
    Sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'someUserId' });
    authMiddleware(req, {}, () => { });
    expect(req)
      .to.have.property('userId');
    expect(req)
      .to.have.property('userId', 'someUserId');
    expect(jwt.verify.called)
      .to.be.true;
    jwt.verify.restore();
  });

  it('Should throw an error if the token cannot be verified', function () {
    const req = { get: headerName => 'Bearer token' };
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw('jwt malformed');
  });
});

