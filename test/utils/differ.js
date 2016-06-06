var expect = require('chai').expect;
var differ = require('../../src/utils/differ.js');

describe('Differ', function() {
  var original = {
    a: 1,
    b: 2,
    c: 3,
  };
  it('returns null if no changed object given', function() {
    var subject = differ(original, null);
    expect(subject).to.eql(null);
  });
  it('returns null if objects are the same', function() {
    var changed = {
      a: 1,
      b: 2,
      c: 3,
    };
    var subject = differ(original, changed);
    expect(subject).to.eql(null);
  });
  it('returns an object with only the different values', function() {
    var changed = {
      a: 1,
      b: 2,
      c: 4,
    };
    var subject = differ(original, changed);
    expect(subject).to.eql({c: 4});
  });
});
