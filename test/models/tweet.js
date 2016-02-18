var expect = require('chai').expect;
var tweet = require('../../src/models/tweet.js');

describe('Tweet', function() {
  it('should encode messages', function() {
    var subject = tweet();
    var encoded = subject.generateMessage('hello world @hello');
    expect(encoded).to.eql('hello%20world%20%40hello');
  });
  it('should remove hash from url', function() {
    var subject = tweet();
    var link = subject.generateLink('http://localhost:3000/#/bill/s2058-114');
    expect(link).to.eql('http://localhost:3000/bill/s2058-114');
  });
});
