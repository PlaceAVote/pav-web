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
  it('returns changed if no original object given', function() {
    var subject = differ(null, {a: 1});
    expect(subject).to.eql({a: 1});
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
  it('should include any additional properties added', function() {
    var changed = {
      a: 1,
      b: 2,
      c: 4,
      d: 5,
    };
    var subject = differ(original, changed);
    expect(subject).to.eql({c: 4, d: 5});
  });
});
