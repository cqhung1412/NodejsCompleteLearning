const { expect } = require('chai');
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
});

