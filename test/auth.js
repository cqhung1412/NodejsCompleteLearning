const { expect } = require('chai');
const { it } = require('mocha');
const authMiddleware = require('../util/is-auth');

it('Should throw an error if there is no authorization header is present', function() {
  const req = { get: headerName => null };
  expect(authMiddleware.bind(this, req, {}, () => {}))
    .to.throw('Not authenticated');
})