const { expect } = require('chai');
const jsonwebtoken = require('jsonwebtoken');
const { it, describe } = require('mocha');
const authMiddleware = require('../util/is-auth');

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

  it('Should throw an error if the token cannot be verified', function () {
    const req = { get: headerName => 'Bearer token' };
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw('jwt malformed');
  });

  it('Should yield a userId after decoding the token', async function () {
    const token = jsonwebtoken.sign({ userId: 'someUserId' }, 'asecretprivatekey');
    const req = { get: headerName => `Bearer ${token}` };
    authMiddleware(req, {}, () => { });
    expect(req)
      .to.have.property('userId');
  });
});

