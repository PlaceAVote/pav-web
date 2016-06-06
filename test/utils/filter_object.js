var expect = require('chai').expect;
var filterObject = require('../../src/utils/filter_object');

describe('Filter Object', function() {
  it('filters out empty strings', function() {
    var o = {
      s: '',
    };
    var result = filterObject(o);
    expect(result).to.eql({});
  });
  it('returns null if object is falsey', function() {
    var result = filterObject(null);
    expect(result).to.eql(null);
  });
  it('filters out undefineds', function() {
    var o = {
      s: undefined,
    };
    var result = filterObject(o);
    expect(result).to.eql({});
  });
  it('filters out nulls', function() {
    var o = {
      s: null,
    };
    var result = filterObject(o);
    expect(result).to.eql({});
  });
  it('does not filter out bools', function() {
    var o = {
      s: false,
    };
    var result = filterObject(o);
    expect(result).to.eql({ s: false });
  });
  it('does not filter out ints', function() {
    var o = {
      s: 0,
    };
    var result = filterObject(o);
    expect(result).to.eql({ s: 0 });
  });
  it('keeps in valid values', function() {
    var o = {
      s: 0,
      b: 'hello',
      c: ['1', 2],
    };
    var result = filterObject(o);
    expect(result).to.eql(o);
  });
});
